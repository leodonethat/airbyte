import { Field, FieldProps, Form, Formik } from "formik";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components";
import * as yup from "yup";

import { LabeledInput, Link } from "components";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { StatusIcon } from "components/ui/StatusIcon";
import { Text } from "components/ui/Text";

import { isCloudApp } from "utils/app";
import { links } from "utils/links";

import styles from "./CreateConnectorModal.module.scss";

export interface CreateConnectorModalProps {
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (sourceDefinition: {
    name: string;
    documentationUrl: string;
    dockerImageTag: string;
    dockerRepository: string;
  }) => Promise<void>;
}

const Content = styled.div`
  width: 585px;
  padding: 19px 41px 30px 36px;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
`;

const FieldContainer = styled.div`
  margin-bottom: 21px;
`;

const Subtitle = styled.div`
  margin-bottom: 26px;
  font-size: 14px;
  line-height: 21px;
  color: ${({ theme }) => theme.darkPrimaryColor};
`;

const DocLink = styled(Link).attrs({ as: "a" })`
  text-decoration: none;
  display: inline-block;
`;

const Error = styled(StatusIcon)`
  padding-top: 4px;
  padding-left: 1px;
  font-size: 17px;
  width: 26px;
  min-width: 26px;
  height: 26px;
`;

const ErrorBlock = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: ${({ theme }) => theme.darkPrimaryColor};
  max-width: 320px;
`;

const ErrorText = styled.div`
  font-weight: normal;
  color: ${({ theme }) => theme.dangerColor};
  max-width: 400px;
`;
const validationSchema = yup.object().shape({
  name: yup.string().trim().required("form.empty.error"),
  documentationUrl: yup.string().trim().url("form.url.error").notRequired(),
  dockerImageTag: yup.string().trim().required("form.empty.error"),
  dockerRepository: yup.string().trim().required("form.empty.error"),
});

const Label: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <Text as="span" bold size="lg" className={styles.label}>
      {children}
    </Text>
  );
};

const CreateConnectorModal: React.FC<CreateConnectorModalProps> = ({ onClose, onSubmit, errorMessage }) => {
  const { formatMessage } = useIntl();

  return (
    <Modal onClose={onClose} title={<FormattedMessage id="admin.addNewConnector" />}>
      <Content>
        <Subtitle>
          <FormattedMessage
            id="admin.learnMore"
            values={{
              lnk: (lnk: React.ReactNode) => (
                <DocLink target="_blank" href={links.docsLink} as="a">
                  {lnk}
                </DocLink>
              ),
            }}
          />
        </Subtitle>
        <Formik
          initialValues={{
            name: "",
            documentationUrl: "",
            dockerImageTag: "",
            dockerRepository: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form>
              <FieldContainer>
                <Field name="name">
                  {({ field, meta }: FieldProps<string>) => (
                    <LabeledInput
                      {...field}
                      type="text"
                      placeholder={formatMessage({
                        id: "admin.connectorName.placeholder",
                      })}
                      label={
                        <Label>
                          <FormattedMessage id="admin.connectorName" />
                        </Label>
                      }
                      error={meta.touched && !!meta.error}
                      message={
                        meta.touched && meta.error ? (
                          <FormattedMessage id={meta.error} />
                        ) : (
                          <FormattedMessage id="form.empty.error" />
                        )
                      }
                    />
                  )}
                </Field>
              </FieldContainer>
              <FieldContainer>
                <Field name="dockerRepository">
                  {({ field, meta }: FieldProps<string>) => (
                    <LabeledInput
                      {...field}
                      type="text"
                      autoComplete="off"
                      placeholder={formatMessage({
                        id: "admin.dockerRepository.placeholder",
                      })}
                      label={
                        <Label>
                          <FormattedMessage
                            id={isCloudApp() ? "admin.dockerFullImageName" : "admin.dockerRepository"}
                          />
                        </Label>
                      }
                      error={meta.touched && !!meta.error}
                      message={
                        meta.touched && meta.error ? (
                          <FormattedMessage id={meta.error} />
                        ) : (
                          <FormattedMessage id="form.empty.error" />
                        )
                      }
                    />
                  )}
                </Field>
              </FieldContainer>
              <FieldContainer>
                <Field name="dockerImageTag">
                  {({ field, meta }: FieldProps<string>) => (
                    <LabeledInput
                      {...field}
                      type="text"
                      autoComplete="off"
                      placeholder={formatMessage({
                        id: "admin.dockerImageTag.placeholder",
                      })}
                      label={
                        <Label>
                          <FormattedMessage id="admin.dockerImageTag" />
                        </Label>
                      }
                      error={!!meta.error && meta.touched}
                      message={
                        meta.touched && meta.error ? (
                          <FormattedMessage id={meta.error} />
                        ) : (
                          <FormattedMessage id="form.empty.error" />
                        )
                      }
                    />
                  )}
                </Field>
              </FieldContainer>
              <FieldContainer>
                <Field name="documentationUrl">
                  {({ field, meta }: FieldProps<string>) => (
                    <LabeledInput
                      {...field}
                      type="text"
                      autoComplete="off"
                      placeholder={formatMessage({
                        id: "admin.documentationUrl.placeholder",
                      })}
                      label={
                        <Label>
                          <FormattedMessage id="admin.documentationUrl" />
                        </Label>
                      }
                      error={meta.touched && !!meta.error}
                      message={meta.error && <FormattedMessage id={meta.error} />}
                    />
                  )}
                </Field>
              </FieldContainer>
              <ButtonContent>
                {errorMessage ? (
                  <ErrorBlock>
                    <Error />
                    <ErrorText>{errorMessage}</ErrorText>
                  </ErrorBlock>
                ) : (
                  <div />
                )}
                <div>
                  <Button
                    className={styles.buttonWithMargin}
                    onClick={onClose}
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                  >
                    <FormattedMessage id="form.cancel" />
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !dirty || !isValid} isLoading={isSubmitting}>
                    <FormattedMessage id="form.add" />
                  </Button>
                </div>
              </ButtonContent>
            </Form>
          )}
        </Formik>
      </Content>
    </Modal>
  );
};

export default CreateConnectorModal;
