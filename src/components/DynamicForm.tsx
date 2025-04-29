import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FormResponse, FormField, FormData } from '../types/form';

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formValues, setFormValues] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: FormField, value: string | string[]): string => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return field.validation?.message || 'This field is required';
    }

    if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
      return `Minimum length should be ${field.minLength}`;
    }

    if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
      return `Maximum length should be ${field.maxLength}`;
    }

    return '';
  };

  const validateSection = (sectionIndex: number): boolean => {
    const currentSectionFields = formData.form.sections[sectionIndex].fields;
    const newErrors: { [key: string]: string } = {};

    currentSectionFields.forEach((field) => {
      const error = validateField(field, formValues[field.fieldId] || '');
      if (error) {
        newErrors[field.fieldId] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormValues({ ...formValues, [fieldId]: value });
    setErrors({ ...errors, [fieldId]: '' });
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Form Data:', formValues);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.fieldId] || '';
    const error = errors[field.fieldId];

    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return (
          <TextField
            fullWidth
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
            error={!!error}
            helperText={error}
            data-testid={field.dataTestId}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
            error={!!error}
            helperText={error}
            data-testid={field.dataTestId}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        );

      case 'radio':
        return (
          <FormControl error={!!error} component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  data-testid={option.dataTestId}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl error={!!error} component="fieldset" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography>
            {field.options?.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={(value as string[] || []).includes(option.value)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(value as string[] || []), option.value]
                        : (value as string[]).filter((v) => v !== option.value);
                      handleFieldChange(field.fieldId, newValue);
                    }}
                  />
                }
                label={option.label}
                data-testid={option.dataTestId}
              />
            ))}
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'dropdown':
        return (
          <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{field.label}</Typography>
            <Select
              value={value}
              onChange={(e) => handleFieldChange(field.fieldId, e.target.value)}
              data-testid={field.dataTestId}
              variant="outlined"
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      default:
        return null;
    }
  };

  const currentSectionData = formData.form.sections[currentSection];

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          {formData.form.formTitle}
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Version: {formData.form.version}
        </Typography>

        <Stepper activeStep={currentSection} alternativeLabel sx={{ mb: 4 }}>
          {formData.form.sections.map((section) => (
            <Step key={section.sectionId}>
              <StepLabel>{section.title}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h5" gutterBottom color="primary">
          Section {currentSection + 1}: {currentSectionData.title}
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          {currentSectionData.description}
        </Typography>

        <Box sx={{ mt: 3 }}>
          {currentSectionData.fields.map((field) => (
            <Box key={field.fieldId}>
              {renderField(field)}
            </Box>
          ))}
        </Box>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please fix the errors before proceeding to the next section.
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {currentSection > 0 && (
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          {currentSection < formData.form.sections.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DynamicForm; 