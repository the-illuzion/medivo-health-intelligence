import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';
import { useAuthStore } from '../store/useAuthStore';

interface EditProfileScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function EditProfileScreen({ onNavigate }: EditProfileScreenProps) {
  const { user, updateProfile } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [allergies, setAllergies] = useState(user?.allergies || '');
  const [goals, setGoals] = useState(user?.goals?.join(', ') || 'Barrier Repair, Hyperpigmentation Reduction');

  const initials = (name || user?.name || 'Patient')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'MP';

  const handleSave = async () => {
    await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      allergies: allergies.trim(),
      goals: goals.split(',').map((g) => g.trim()).filter(Boolean),
    });
    onNavigate('profile');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('profile')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar Change */}
      <View style={styles.avatarBox}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <TouchableOpacity style={styles.changePicBtn}>
          <Feather name="camera" size={14} color="#4338CA" />
          <Text style={styles.changePicText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Personal Identity Fields */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>

        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputBox}>
          <Feather name="user" size={18} color="#94A3B8" />
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>

        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputBox}>
          <Feather name="mail" size={18} color="#94A3B8" />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.inputBox}>
          <Feather name="phone" size={18} color="#94A3B8" />
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
      </View>

      {/* Medical & Skin Profile Fields */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medical & Skin Sensitivities</Text>

        <Text style={styles.label}>Known Allergies / Sensitivities</Text>
        <View style={styles.inputBox}>
          <Feather name="alert-circle" size={18} color="#94A3B8" />
          <TextInput style={styles.input} value={allergies} onChangeText={setAllergies} />
        </View>

        <Text style={styles.label}>Primary Skin Health Goals</Text>
        <View style={styles.inputBox}>
          <Feather name="target" size={18} color="#94A3B8" />
          <TextInput style={styles.input} value={goals} onChangeText={setGoals} />
        </View>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={() => onNavigate('profile')}>
        <Text style={styles.submitBtnText}>Save Profile Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  saveText: { fontSize: 14, fontWeight: '700', color: '#4338CA' },
  avatarBox: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4338CA', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  changePicBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  changePicText: { fontSize: 12, fontWeight: '700', color: '#4338CA', marginLeft: 4 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E1B4B', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 6, marginTop: 10 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0F172A' },
  submitBtn: { backgroundColor: '#4338CA', paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
