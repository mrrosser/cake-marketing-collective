import { startTransition, useMemo, useState, type ChangeEvent, type SyntheticEvent } from 'react';

import {
  basicInformationSection,
  intakeBranches,
  type IntakeFieldDefinition,
  type IntakeSectionDefinition,
} from '../../lib/intake/forms';
import { resolveIntakeBranch } from '../../lib/intake/routing';

interface Props {
  bookingUrl: string;
  email: string;
  initialService?: string;
}

type FormValue = string | string[];
type FormState = Record<string, FormValue>;

interface SubmissionResult {
  ok: boolean;
  correlationId: string;
  routing: {
    path: 'discovery' | 'strategy';
    nextStepHeading: string;
    nextStepBody: string;
  };
  designSignal: {
    shouldCreateStitchProject: boolean;
    reason: string;
  };
}

const finalSection: IntakeSectionDefinition = {
  id: 'final-note',
  title: 'Final Question',
  fields: [
    {
      id: 'finalNote',
      label: 'Is there anything else we should know before building your strategy?',
      type: 'textarea',
    },
  ],
};

export function IntakeFlow({ bookingUrl, email, initialService = 'brand strategy' }: Props) {
  const [selectedService, setSelectedService] = useState(initialService);
  const [formState, setFormState] = useState<FormState>({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const branch = useMemo(() => resolveIntakeBranch(selectedService), [selectedService]);
  const sections = useMemo(
    () => [basicInformationSection, ...branch.sections, finalSection],
    [branch],
  );
  const currentSection = sections[step];
  const progress = Math.round(((step + 1) / sections.length) * 100);

  function updateValue(fieldId: string, nextValue: FormValue) {
    setFormState((current) => ({
      ...current,
      [fieldId]: nextValue,
    }));
  }

  function handleTextChange(field: IntakeFieldDefinition, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    updateValue(field.id, event.target.value);
  }

  function handleMultiSelectToggle(field: IntakeFieldDefinition, option: string) {
    const currentValue = formState[field.id];
    const values = Array.isArray(currentValue) ? currentValue : [];
    const nextValues = values.includes(option)
      ? values.filter((value) => value !== option)
      : [...values, option];
    updateValue(field.id, nextValues);
  }

  function validateCurrentStep() {
    const missing = currentSection.fields.find((field) => {
      if (!field.required) {
        return false;
      }

      const value = formState[field.id];

      if (Array.isArray(value)) {
        return value.length === 0;
      }

      return !value || value.toString().trim().length === 0;
    });

    if (missing) {
      setError(`Complete "${missing.label}" before moving on.`);
      return false;
    }

    setError('');
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      return;
    }

    setStep((current) => Math.min(current + 1, sections.length - 1));
  }

  function goBack() {
    setError('');
    setStep((current) => Math.max(current - 1, 0));
  }

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    const basicFieldIds = new Set(basicInformationSection.fields.map((field) => field.id));
    const basicInfo = Object.fromEntries(
      Object.entries(formState).filter(([key]) => basicFieldIds.has(key)),
    );
    const answers = Object.fromEntries(
      Object.entries(formState).filter(([key]) => !basicFieldIds.has(key) && key !== 'finalNote'),
    );

    const response = await fetch('/api/intake/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service: selectedService,
        branchKey: branch.key,
        basicInfo,
        answers,
        finalNote: formState.finalNote ?? '',
      }),
    });

    const payload = (await response.json()) as SubmissionResult & { error?: string };

    if (!response.ok || !payload.ok) {
      setError(payload.error ?? 'Unable to submit the intake right now.');
      setIsSubmitting(false);
      return;
    }

    startTransition(() => {
      setResult(payload);
      setIsSubmitting(false);
    });
  };

  if (result) {
    const ctaHref =
      result.routing.path === 'discovery'
        ? bookingUrl
        : `mailto:${email}?subject=Strategy Session Follow-Up`;

    return (
      <section className="app-card intake-result">
        <p className="app-eyebrow">Intake submitted</p>
        <h3>{result.routing.nextStepHeading}</h3>
        <p>{result.routing.nextStepBody}</p>
        <div className="app-tag-row">
          <span className="app-tag">Correlation ID: {result.correlationId}</span>
          <span className="app-tag">
            Stitch: {result.designSignal.shouldCreateStitchProject ? 'queued' : 'manual review'}
          </span>
        </div>
        <p>{result.designSignal.reason}</p>
        <div className="app-button-row">
          <a className="app-button" href={ctaHref}>
            {result.routing.path === 'discovery'
              ? 'Book a Call'
              : 'We’ll review and follow up within 48 hours'}
          </a>
          <button
            className="app-button app-button-ghost"
            type="button"
            onClick={() => {
              setResult(null);
              setStep(0);
              setFormState({});
            }}
          >
            Submit another intake
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="intake-shell">
      <article className="app-card intake-overview">
        <p className="app-eyebrow">Native Intake</p>
        <h3>Each service runs its own progressive intake branch.</h3>
        <p>
          Shared basic information up front, service-specific questions after that, and routing
          into discovery or strategy based on the actual answers.
        </p>
        <div className="service-pill-grid">
          {intakeBranches.map((option) => {
            const selected = option.key === branch.key;
            return (
              <button
                className={`service-pill ${selected ? 'service-pill--active' : ''}`}
                key={option.key}
                type="button"
                onClick={() => {
                  setSelectedService(option.label);
                  setStep(0);
                  setError('');
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </article>

      <article className="app-card intake-form-card">
        <div className="intake-progress">
          <div className="intake-progress__bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% complete</span>
        </div>

        <div className="intake-copy">
          <p className="app-eyebrow">{branch.label}</p>
          <h3>{branch.heroTitle}</h3>
          <p>{branch.heroDescription}</p>
          <strong>{currentSection.title}</strong>
          {currentSection.description ? <p>{currentSection.description}</p> : null}
        </div>

        <form className="intake-form" onSubmit={(event) => void handleSubmit(event)}>
          {currentSection.fields.map((field) => (
            <label className="intake-field" key={field.id}>
              <span>{field.label}</span>
              {renderField(field, formState[field.id], handleTextChange, handleMultiSelectToggle)}
            </label>
          ))}

          {error ? <p className="intake-error">{error}</p> : null}

          <div className="app-button-row">
            <button className="app-button app-button-ghost" disabled={step === 0} onClick={goBack} type="button">
              Back
            </button>
            {step < sections.length - 1 ? (
              <button className="app-button" onClick={goNext} type="button">
                Continue
              </button>
            ) : (
              <button className="app-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Submitting...' : 'Submit Intake'}
              </button>
            )}
          </div>
        </form>
      </article>
    </section>
  );
}

function renderField(
  field: IntakeFieldDefinition,
  value: FormValue | undefined,
  onTextChange: (
    field: IntakeFieldDefinition,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void,
  onMultiSelectToggle: (field: IntakeFieldDefinition, option: string) => void,
) {
  if (field.type === 'textarea') {
    return (
      <textarea
        name={field.id}
        placeholder={field.placeholder}
        required={field.required}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onTextChange(field, event)}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        name={field.id}
        required={field.required}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onTextChange(field, event)}
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'radio') {
    return (
      <div className="choice-grid">
        {field.options?.map((option) => (
          <label className="choice-chip" key={option.value}>
            <input
              checked={value === option.value}
              name={field.id}
              type="radio"
              value={option.value}
              onChange={(event) => onTextChange(field, event)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === 'multiselect') {
    const values = Array.isArray(value) ? value : [];

    return (
      <div className="choice-grid">
        {field.options?.map((option) => (
          <label className="choice-chip" key={option.value}>
            <input
              checked={values.includes(option.value)}
              name={`${field.id}-${option.value}`}
              type="checkbox"
              onChange={() => onMultiSelectToggle(field, option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <input
      name={field.id}
      placeholder={field.placeholder}
      required={field.required}
      type={field.type}
      value={typeof value === 'string' ? value : ''}
      onChange={(event) => onTextChange(field, event)}
    />
  );
}
