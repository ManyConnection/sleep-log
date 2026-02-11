import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { AMOUNT_PRESETS, Colors } from '@/constants';

interface AmountSelectorProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

export function AmountSelector({ amount, onAmountChange }: AmountSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>量を選択</Text>
      
      {/* プリセットボタン */}
      <View style={styles.presets}>
        {AMOUNT_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.amount}
            style={[
              styles.presetButton,
              amount === preset.amount && styles.presetButtonSelected,
            ]}
            onPress={() => onAmountChange(preset.amount)}
            activeOpacity={0.7}
          >
            <Text style={styles.presetEmoji}>{preset.emoji}</Text>
            <Text style={[
              styles.presetAmount,
              amount === preset.amount && styles.presetAmountSelected,
            ]}>
              {preset.amount}ml
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* カスタム入力 */}
      <View style={styles.customInput}>
        <Text style={styles.customLabel}>カスタム量:</Text>
        <TextInput
          style={styles.input}
          value={amount.toString()}
          onChangeText={(text) => {
            const num = parseInt(text) || 0;
            onAmountChange(num);
          }}
          keyboardType="number-pad"
          maxLength={4}
        />
        <Text style={styles.unit}>ml</Text>
      </View>

      {/* 調整ボタン */}
      <View style={styles.adjustButtons}>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => onAmountChange(Math.max(0, amount - 50))}
        >
          <Text style={styles.adjustText}>-50</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => onAmountChange(Math.max(0, amount - 10))}
        >
          <Text style={styles.adjustText}>-10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => onAmountChange(amount + 10)}
        >
          <Text style={styles.adjustText}>+10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => onAmountChange(amount + 50)}
        >
          <Text style={styles.adjustText}>+50</Text>
        </TouchableOpacity>
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
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetButton: {
    width: '18%',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  presetEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  presetAmount: {
    fontSize: 11,
    color: Colors.textLight,
  },
  presetAmountSelected: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  customInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  customLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    width: 100,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unit: {
    fontSize: 16,
    color: Colors.textLight,
    marginLeft: 8,
  },
  adjustButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  adjustButton: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adjustText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
