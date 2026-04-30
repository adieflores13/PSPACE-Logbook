// app/flightscreen/add_flight.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import ScreenLayout from '@/components/layout/screen-layout';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type FlightType = 'Commercial' | 'Private' | 'Cargo' | 'Charter' | '';

interface FlightForm {
  date: Date | null;
  type: FlightType;
  totalTime: string;
  notes: string;
}



// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AddFlightScreen() {
  const router = useRouter();

  const [form, setForm] = useState<FlightForm>({
    date: null,
    type: '',
    totalTime: '',
    notes: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const flightTypes: FlightType[] = ['Commercial', 'Private', 'Cargo', 'Charter'];

  const handleAdd = () => {
    if (!form.date || !form.type || !form.totalTime) {
      Alert.alert('Incomplete Form', 'Please fill in Date, Type, and Total Time.');
      return;
    }
    Alert.alert(
      'Flight Added',
      `${form.type} flight on ${form.date.toDateString()} (${form.totalTime} hrs) logged!`,
    );
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    // ScreenLayout provides the shared footer nav across all pages
    <ScreenLayout>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.amber} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="airplane-cog" size={36} color={COLORS.navy} />
          </View>
        </View>

        <Text style={styles.headerTitle}>Add Flight</Text>
      </View>

      {/* ── FORM ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Date */}
        <TouchableOpacity
          style={styles.field}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.fieldIcon}>
            <Ionicons name="airplane-outline" size={20} color={COLORS.amber} />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Input Date</Text>
            <Text style={[styles.fieldValue, !form.date && styles.fieldPlaceholder]}>
              {form.date ? formatDate(form.date) : 'Date:'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.date ?? new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setForm(f => ({ ...f, date: selected }));
            }}
          />
        )}

        {/* Type */}
        <TouchableOpacity
          style={styles.field}
          onPress={() => setShowTypePicker(v => !v)}
          activeOpacity={0.7}
        >
          <View style={styles.fieldIcon}>
            <MaterialCommunityIcons name="monitor-dashboard" size={20} color={COLORS.amber} />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Input Type</Text>
            <Text style={[styles.fieldValue, !form.type && styles.fieldPlaceholder]}>
              {form.type || 'Type:'}
            </Text>
          </View>
          <Ionicons
            name={showTypePicker ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={COLORS.muted}
          />
        </TouchableOpacity>

        {showTypePicker && (
          <View style={styles.dropdown}>
            {flightTypes.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.dropdownItem, form.type === t && styles.dropdownItemActive]}
                onPress={() => {
                  setForm(f => ({ ...f, type: t }));
                  setShowTypePicker(false);
                }}
              >
                <Text style={[styles.dropdownText, form.type === t && styles.dropdownTextActive]}>
                  {t}
                </Text>
                {form.type === t && <Ionicons name="checkmark" size={16} color={COLORS.amber} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Total Time */}
        <View style={styles.field}>
          <View style={styles.fieldIcon}>
            <Ionicons name="time-outline" size={20} color={COLORS.amber} />
          </View>
          <View style={styles.fieldContent}>
            <Text style={styles.fieldLabel}>Input Total Time</Text>
            <TextInput
              style={styles.inlineInput}
              placeholder="Total Time: (e.g. 2.5)"
              placeholderTextColor={COLORS.muted}
              value={form.totalTime}
              onChangeText={v => setForm(f => ({ ...f, totalTime: v }))}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesField}>
          <TextInput
            style={styles.notesInput}
            placeholder="Notes..."
            placeholderTextColor={COLORS.muted}
            value={form.notes}
            onChangeText={v => setForm(f => ({ ...f, notes: v }))}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnAdd} onPress={handleAdd} activeOpacity={0.85}>
            <Text style={styles.btnAddText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLORS & STYLES  (unchanged from your original)
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  amber: '#F5A623', amberLight: '#FFC04D', navy: '#1A2340', navyLight: '#2C3A5C',
  white: '#FFFFFF', offWhite: '#F7F8FC', muted: '#9AA3B8', border: '#E4E8F0', red: '#D64045',
};

const styles = StyleSheet.create({
  header: { backgroundColor: COLORS.amber, paddingTop: 34, paddingBottom: 20, alignItems: 'center' },
  backBtn: { position: 'absolute', left: 20, top: 12, padding: 6, zIndex: 10 },
  logoWrap: { marginBottom: 10 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.navy, letterSpacing: 0.3 },
  scroll: { flex: 1, backgroundColor: COLORS.offWhite },
  formContainer: { padding: 20, paddingBottom: 40, gap: 12 },
  field: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    borderWidth: 1, borderColor: COLORS.border,
  },
  fieldIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.offWhite, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  fieldContent: { flex: 1 },
  fieldLabel: { fontSize: 11, color: COLORS.muted, fontWeight: '500', marginBottom: 2, letterSpacing: 0.3 },
  fieldValue: { fontSize: 15, color: COLORS.navy, fontWeight: '700' },
  fieldPlaceholder: { color: COLORS.muted, fontWeight: '600' },
  inlineInput: { fontSize: 15, color: COLORS.navy, fontWeight: '700', padding: 0, margin: 0 },
  dropdown: {
    backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4, marginTop: -6,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  dropdownItemActive: { backgroundColor: '#FFF8EC' },
  dropdownText: { fontSize: 15, color: COLORS.navyLight, fontWeight: '500' },
  dropdownTextActive: { color: COLORS.amber, fontWeight: '700' },
  notesField: {
    backgroundColor: COLORS.white, borderRadius: 14, padding: 16, minHeight: 120,
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  notesInput: { flex: 1, fontSize: 14, color: COLORS.navy, minHeight: 90 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnAdd: {
    flex: 1, backgroundColor: COLORS.amber, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', shadowColor: COLORS.amber,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  btnAddText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  btnCancel: {
    flex: 1, backgroundColor: COLORS.navy, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  btnCancelText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});