import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { DesignFrame } from '../src/features/design-preview/components/Shell';
import Devices from '../src/features/design-preview/screens/Devices';
import { Copy, Icon, Tile, s } from '../src/features/design-preview/components/UI';
import { colors as c } from '../src/features/design-preview/tokens';
import { useHealthSummary } from '../src/hooks/useHealthSummary';
import { formatHealthLastSync } from '../src/services/health/healthDisplay';

export default function DevicesScreen() {
  const router = useRouter();
  const { connection } = useHealthSummary('day');

  return (
    <DesignFrame>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Manage Apple Health"
          onPress={() => router.push('/connected-devices')}
          style={({ pressed }) => [styles.appleHealth, pressed && styles.pressed]}
        >
          <Tile name="heart" tone="red" size={38} />
          <View style={s.flex}>
            <Copy bold size={12}>Apple Health</Copy>
            <Copy size={10} color={connection ? c.green : c.muted}>
              ● {connection ? 'Connected' : 'Not connected'}
            </Copy>
            <Copy size={9} color={c.muted}>
              {connection
                ? `Last sync: ${formatHealthLastSync(connection.lastSyncedAt)} · Syncs when you choose Sync in Medivo`
                : 'Read-only HealthKit connection · foreground sync only'}
            </Copy>
          </View>
          <View style={styles.manage}>
            <Copy size={11} bold color={c.blue}>{connection ? 'Manage' : 'Connect'}</Copy>
            <Icon name="chevron" size={14} color={c.blue} />
          </View>
        </Pressable>
        <View style={s.flex}>
          <Devices />
        </View>
      </View>
    </DesignFrame>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background },
  appleHealth: {
    marginHorizontal: 18,
    marginTop: 12,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manage: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  pressed: { opacity: 0.72 },
});
