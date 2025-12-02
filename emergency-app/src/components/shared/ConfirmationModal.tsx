import { useTheme } from '../../hooks/useTheme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  singleButton?: boolean;
}

export default function ConfirmationModal({
  visible,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText,
  singleButton = false,
}: ConfirmationModalProps) {
  const { t } = useTranslation();
  const defaultConfirmText = t('common.confirm');
  const defaultCancelText = t('common.cancel');
  const actualConfirmText = confirmText || defaultConfirmText;
  const actualCancelText = cancelText || defaultCancelText;
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.text + '80',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.l,
      width: '80%',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: theme.spacing.l,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      textAlign: 'center',
    },
    message: {
      fontSize: theme.spacing.m,
      color: theme.colors.text,
      marginBottom: theme.spacing.l,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderRadius: theme.spacing.s,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: theme.spacing.s / 2,
    },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.text,
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButtonText: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: theme.spacing.m,
    },
    confirmButtonText: {
      color: theme.colors.surface,
      fontWeight: '600',
      fontSize: theme.spacing.m,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {!singleButton && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>{actualCancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{actualConfirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
