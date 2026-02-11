import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AMOUNT_PRESETS, Colors } from '@/constants';

interface QuickAddButtonsProps {
  onAdd: (amount: number) => void;
}

export function QuickAddButtons({ onAdd }: QuickAddButtonsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>クイック記録</Text>
      <View style={styles.grid}>
        {AMOUNT_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.amount}
            style={styles.button}
            onPress={() => onAdd(preset.amount)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{preset.emoji}</Text>
            <Text style={styles.label}>{preset.label}</Text>
            <Text style={styles.amount}>{preset.amount}ml</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '30%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
