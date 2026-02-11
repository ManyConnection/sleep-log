import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants';
import { DrinkTypeSelector, AmountSelector } from '@/components';
import { useRecords } from '@/hooks';
import { DrinkType } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export default function RecordScreen() {
  const { addRecord } = useRecords();
  const [selectedType, setSelectedType] = useState<DrinkType>('water');
  const [amount, setAmount] = useState(200);

  const handleSave = async () => {
    if (amount <= 0) {
      Alert.alert('エラー', '量を入力してください');
      return;
    }

    await addRecord(selectedType, amount);
    Alert.alert(
      '記録完了',
      `${amount}ml を記録しました 💧`,
      [{ text: 'OK' }]
    );
    
    // リセット
    setAmount(200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 飲み物の種類選択 */}
        <DrinkTypeSelector selected={selectedType} onSelect={setSelectedType} />

        {/* 量の選択 */}
        <AmountSelector amount={amount} onAmountChange={setAmount} />

        {/* プレビュー */}
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>記録内容</Text>
          <View style={styles.previewContent}>
            <Text style={styles.previewAmount}>{amount}ml</Text>
          </View>
        </View>

        {/* 記録ボタン */}
        <TouchableOpacity
          style={[styles.saveButton, amount <= 0 && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={amount <= 0}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color={Colors.surface} />
          <Text style={styles.saveButtonText}>記録する</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  preview: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textMuted,
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
