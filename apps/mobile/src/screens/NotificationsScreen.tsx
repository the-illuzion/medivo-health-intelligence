import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScreenKey } from '@medivo/types';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenKey) => void;
}

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const [filter, setFilter] = useState('All');

  const notifications = [
    { id: 1, title: 'AI Skin Diagnostic Ready', body: 'Your latest scan score updated to 87/100 (+4 points).', category: 'Scans', time: '10m ago', unread: true, screen: 'scanReport' as ScreenKey, icon: 'camera', tint: '#EEF2FF', color: '#4338CA' },
    { id: 2, title: 'Morning Routine Reminder', body: 'Time to complete your Hydra Renew morning regimen step.', category: 'Reminders', time: '2h ago', unread: true, screen: 'routines' as ScreenKey, icon: 'check-square', tint: '#FEF3C7', color: '#D97706' },
    { id: 3, title: 'Prescription Dispatched', body: 'Order #MED-84920 is in transit via FedEx Express Overnight.', category: 'Orders', time: '5h ago', unread: false, screen: 'orderDetails' as ScreenKey, icon: 'truck', tint: '#ECFDF5', color: '#059669' },
    { id: 4, title: 'Upcoming Telehealth Review', body: 'Dr. Aris Thorne is confirmed for your video consultation tomorrow.', category: 'Appointments', time: '1d ago', unread: false, screen: 'consultations' as ScreenKey, icon: 'user-check', tint: '#E0F2FE', color: '#0284C7' },
  ];

  const filtered = filter === 'All' ? notifications : notifications.filter((n) => n.category === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate('dashboard')}>
          <Feather name="arrow-left" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.markAllText}>Mark read</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {['All', 'Scans', 'Reminders', 'Orders', 'Appointments'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterPill, filter === cat && styles.filterPillActive]}
            onPress={() => setFilter(cat)}
          >
            <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <View style={styles.list}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.notifCard, item.unread && styles.notifCardUnread]}
            onPress={() => onNavigate(item.screen)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconBox, { backgroundColor: item.tint }]}>
              <Feather name={item.icon as any} size={20} color={item.color} />
            </View>

            <View style={styles.notifMeta}>
              <View style={styles.notifTop}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
            </View>

            {item.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EEF0F7' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E1B4B' },
  markAllText: { fontSize: 13, color: '#4338CA', fontWeight: '700' },
  filterScroll: { marginBottom: 20 },
  filterContent: { gap: 8 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EEF0F7' },
  filterPillActive: { backgroundColor: '#4338CA', borderColor: '#4338CA' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  filterTextActive: { color: '#FFFFFF' },
  list: { gap: 12 },
  notifCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#EEF0F7' },
  notifCardUnread: { borderColor: '#C7D2FE', backgroundColor: '#F8FAFC' },
  iconBox: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  notifMeta: { flex: 1, marginLeft: 12, marginRight: 8 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#1E1B4B' },
  notifTime: { fontSize: 11, color: '#94A3B8' },
  notifBody: { fontSize: 12, color: '#64748B', marginTop: 4, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4338CA', marginTop: 6 },
});
