import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const colors = {
  background: '#F3F5F4',
  headerGreen: '#074E2B',
  darkGreen: '#053E22',
  green: '#074E2B',
  text: '#19251E',
  muted: '#697770',
  border: '#E3EBE6',
  white: '#FFFFFF',
  amber: '#D97706',
  paleAmber: '#FFF9E6',
  paleGreen: '#EBF4EF',
  lightBlue: '#E7F3F8',
  iconBlue: '#0288D1',
  iconGreen: '#074E2B',
};

export function Page({ children, refreshing, onRefresh, style, contentStyle }) {
  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, style]}>
      <ScrollView
        contentContainerStyle={[styles.page, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={Boolean(refreshing)}
              onRefresh={onRefresh}
              tintColor={colors.green}
              colors={[colors.green]}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function HeaderNav({ title, onBack }) {
  return (
    <View style={styles.navHeader}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={24} color="#1C2721" />
      </Pressable>
      <Text style={styles.navHeaderTitle}>{title}</Text>
      <View style={{ width: 32 }} />
    </View>
  );
}

export function Heading({ title, subtitle }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headingSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.card, style, pressed && styles.cardPressed]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children, action }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action}
    </View>
  );
}

export function ActionButton({ title, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        secondary && styles.secondaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton,
      ]}
    >
      <Text style={[styles.actionButtonText, secondary && styles.secondaryButtonText]}>{title}</Text>
    </Pressable>
  );
}

export function InlineButton({ title, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
      <Text style={styles.inlineButton}>{title}</Text>
    </Pressable>
  );
}

export function Notice({ title, message, onRetry, tone = 'error' }) {
  const warning = tone === 'warning';
  return (
    <View style={[styles.notice, warning ? styles.warningNotice : styles.errorNotice]}>
      <Text style={[styles.noticeTitle, warning && styles.warningText]}>{title}</Text>
      <Text style={[styles.noticeMessage, warning && styles.warningText]}>{message}</Text>
      {onRetry ? <InlineButton title="ફરી પ્રયાસ કરો · Retry" onPress={onRetry} /> : null}
    </View>
  );
}

export function Loading({ label = 'લોડ થઈ રહ્યું છે…' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.green} size="small" />
      <Text style={styles.loadingText}>{label}</Text>
    </View>
  );
}

export function ConditionCard({ iconName, iconType = 'feather', label, value, style }) {
  const renderIcon = () => {
    if (iconType === 'material') {
      return <MaterialCommunityIcons name={iconName} size={24} color={colors.iconBlue} />;
    }
    if (iconType === 'ionicons') {
      return <Ionicons name={iconName} size={24} color={colors.iconBlue} />;
    }
    return <Feather name={iconName} size={22} color={colors.iconBlue} />;
  };

  return (
    <View style={[styles.conditionCard, style]}>
      <View style={styles.conditionIconBadge}>{renderIcon()}</View>
      <Text style={styles.conditionLabel}>{label}</Text>
      <Text style={styles.conditionValue}>{value ?? '—'}</Text>
    </View>
  );
}

export function Metric({ label, value, unit, accent }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, accent && { color: accent }]}>{value ?? '—'}</Text>
      {unit ? <Text style={styles.metricUnit}>{unit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  navHeader: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  backBtn: {
    alignItems: 'center',
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  pressed: { opacity: 0.6 },
  navHeaderTitle: {
    color: '#16211A',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  heading: {
    gap: 4,
    paddingTop: 4,
  },
  headingTitle: {
    color: colors.darkGreen,
    fontSize: 24,
    fontWeight: '800',
  },
  headingSubtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderColor: '#E7EDE8',
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  sectionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.darkGreen,
    fontSize: 18,
    fontWeight: '800',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.paleGreen,
    borderColor: '#C7E4D3',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: colors.green,
  },
  disabledButton: {
    opacity: 0.55,
  },
  pressedButton: {
    opacity: 0.82,
  },
  inlineButton: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  notice: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    padding: 13,
  },
  errorNotice: {
    backgroundColor: '#FFF1F0',
    borderColor: '#F3C9C6',
  },
  warningNotice: {
    backgroundColor: colors.paleAmber,
    borderColor: '#F0D5A7',
  },
  noticeTitle: {
    color: '#9D3027',
    fontSize: 13,
    fontWeight: '800',
  },
  noticeMessage: {
    color: '#803A34',
    fontSize: 12,
    lineHeight: 18,
  },
  warningText: {
    color: colors.amber,
  },
  loading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 18,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 13,
  },
  conditionCard: {
    backgroundColor: colors.white,
    borderColor: '#E8EEEA',
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    minWidth: '47%',
    padding: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  conditionIconBadge: {
    alignItems: 'center',
    backgroundColor: '#EBF4F9',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  conditionLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  conditionValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  metric: {
    backgroundColor: '#F5F8F6',
    borderRadius: 14,
    flex: 1,
    gap: 3,
    minWidth: '43%',
    padding: 12,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
  },
  metricValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  metricUnit: {
    color: colors.muted,
    fontSize: 10,
  },
});

