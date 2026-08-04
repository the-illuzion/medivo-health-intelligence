import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Doctor } from '@medivo/types';
import { apiClient } from '@medivo/api-client';

export function ConsultationsScreen() {
  const [selectedSlot, setSelectedSlot] = useState<Record<number, string>>({});
  const [booked, setBooked] = useState<Record<number, boolean>>({});
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: 'Dr. Aris Thorne, MD',
      title: 'Board-Certified Dermatologist',
      rating: 4.9,
      reviewsCount: 142,
      specialty: 'Clinical Dermatology & Tele-Health',
      price: 95,
      nextAvailable: 'Today at 03:00 PM',
      avatarBg: '#4338CA',
      slots: ['03:00 PM', '04:30 PM', '06:00 PM'],
    },
    {
      id: 2,
      name: 'Dr. Elena Rostova, MD',
      title: 'Cosmetic & Laser Specialist',
      rating: 4.8,
      reviewsCount: 98,
      specialty: 'Pigmentation & Acne Barrier Therapy',
      price: 110,
      nextAvailable: 'Tomorrow at 10:00 AM',
      avatarBg: '#059669',
      slots: ['10:00 AM', '01:30 PM', '03:00 PM'],
    },
  ]);

  useEffect(() => {
    async function fetchLiveDoctors() {
      try {
        const liveDoctors = await apiClient.doctors.list();
        if (liveDoctors && liveDoctors.length > 0) {
          setDoctors(liveDoctors);
        }
      } catch (err) {
        // Fallback to initial state if server is offline
      }
    }
    fetchLiveDoctors();
  }, []);

  function selectSlot(docId: string, slot: string) {
    setSelectedSlot((prev: any) => ({ ...prev, [docId]: slot }));
  }

  function handleConfirmBook(docId: string) {
    setBooked((prev: any) => ({ ...prev, [docId]: true }));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Telehealth Consultations</Text>
        <Text style={styles.headerSub}>Book virtual video reviews with licensed dermatologists</Text>
      </View>

      {/* Active Upcoming Appointment Banner */}
      <View style={styles.upcomingCard}>
        <View style={styles.upcomingHeader}>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>UPCOMING CONSULTATION</Text>
          </View>
          <Text style={styles.upcomingDate}>Jul 30 · 04:00 PM</Text>
        </View>

        <View style={styles.docRow}>
          <View style={[styles.avatarBox, { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.avatarText, { color: '#4338CA' }]}>AT</Text>
          </View>
          <View style={styles.docInfo}>
            <Text style={styles.upcomingDocName}>Dr. Aris Thorne, MD</Text>
            <Text style={styles.upcomingDocSpec}>Board-Certified Dermatologist</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.joinBtn}>
          <Feather name="video" size={16} color="#4338CA" />
          <Text style={styles.joinBtnText}>Join Video Consultation Room</Text>
        </TouchableOpacity>
      </View>

      {/* Clinician Directory */}
      <Text style={styles.sectionTitle}>Available Dermatologists</Text>
      {doctors.map((doc: any) => {
        const isAlreadyBooked = !!booked[doc.id];
        const activeSlot = selectedSlot[doc.id] || doc.slots[0];

        return (
          <View key={doc.id} style={styles.doctorCard}>
            <View style={styles.cardTop}>
              <View style={[styles.avatarBox, { backgroundColor: doc.avatarBg }]}>
                <Text style={styles.avatarText}>{doc.name.split(' ')[1][0]}{doc.name.split(' ')[2][0]}</Text>
              </View>

              <View style={styles.docMainInfo}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <View style={styles.ratingBox}>
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingVal}>{doc.rating} ({doc.reviewsCount} reviews)</Text>
                </View>
              </View>

              <View style={styles.priceBox}>
                <Text style={styles.priceText}>${doc.price}</Text>
                <Text style={styles.priceSub}>/ session</Text>
              </View>
            </View>

            <Text style={styles.specialtyText}>{doc.specialty}</Text>

            {/* Time Slot Selector */}
            <Text style={styles.slotTitle}>Select Time Slot:</Text>
            <View style={styles.slotGroup}>
              {doc.slots.map((slot: string) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotPill, activeSlot === slot && styles.slotPillActive]}
                  onPress={() => selectSlot(doc.id, slot)}
                >
                  <Text style={[styles.slotText, activeSlot === slot && styles.slotTextActive]}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm Book Button */}
            <TouchableOpacity
              style={[styles.bookBtn, isAlreadyBooked && styles.bookBtnDone]}
              onPress={() => handleConfirmBook(doc.id)}
              disabled={isAlreadyBooked}
            >
              <Feather name={isAlreadyBooked ? "check-circle" : "calendar"} size={16} color={isAlreadyBooked ? '#059669' : '#FFFFFF'} />
              <Text style={[styles.bookBtnText, isAlreadyBooked && styles.bookBtnTextDone]}>
                {isAlreadyBooked ? `Booked for ${activeSlot}` : `Book Appointment (${activeSlot})`}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 120 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1E1B4B' },
  headerSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  upcomingCard: { backgroundColor: '#4338CA', padding: 20, borderRadius: 24, marginBottom: 24 },
  upcomingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  liveBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  liveBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  upcomingDate: { color: '#C7D2FE', fontSize: 12, fontWeight: '600' },
  docRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  docInfo: { marginLeft: 12 },
  upcomingDocName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  upcomingDocSpec: { color: '#C7D2FE', fontSize: 12, marginTop: 2 },
  joinBtn: { backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  joinBtnText: { color: '#4338CA', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E1B4B', marginBottom: 14 },
  doctorCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: '#EEF0F7', marginBottom: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  docMainInfo: { flex: 1, marginLeft: 12 },
  docName: { fontSize: 15, fontWeight: '700', color: '#1E1B4B' },
  docTitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  ratingBox: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingVal: { fontSize: 11, color: '#64748B', marginLeft: 4, fontWeight: '600' },
  priceBox: { alignItems: 'flex-end' },
  priceText: { fontSize: 18, fontWeight: '800', color: '#1E1B4B' },
  priceSub: { fontSize: 10, color: '#64748B' },
  specialtyText: { fontSize: 12, color: '#4338CA', fontWeight: '600', marginTop: 12, backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: 'flex-start' },
  slotTitle: { fontSize: 12, fontWeight: '700', color: '#1E1B4B', marginTop: 14, marginBottom: 8 },
  slotGroup: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  slotPill: { flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  slotPillActive: { backgroundColor: '#4338CA' },
  slotText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  slotTextActive: { color: '#FFFFFF' },
  bookBtn: { backgroundColor: '#4338CA', paddingVertical: 12, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  bookBtnDone: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' },
  bookBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginLeft: 6 },
  bookBtnTextDone: { color: '#059669' },
});
