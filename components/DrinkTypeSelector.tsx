import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DRINK_TYPES, Colors } from '@/constants';
import { DrinkType } from '@/types';

interface DrinkTypeSelectorProps {
  selected: DrinkType;
  onSelect: (type: DrinkType) => void;
}

export function DrinkTypeSelector({ selected, onSelect }: DrinkTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>飲み物の種類</Text>
      <View style={styles.grid}>
        {DRINK_TYPES.map((drink) => (
          <TouchableOpacity
            key={drink.type}
            style={[
              styles.button,
              selected === drink.type && { backgroundColor: drink.color + '20', borderColor: drink.color },
            ]}
            onPress={() => onSelect(drink.type)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{drink.emoji}</Text>
            <Text style={[styles.label, selected === drink.type && { color: drink.color }]}>
              {drink.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
