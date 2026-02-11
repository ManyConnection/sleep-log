import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { DrinkRecord } from '@/types';
import { DRINK_TYPES, Colors } from '@/constants';
import { formatTime } from '@/utils';
import { Ionicons } from '@expo/vector-icons';

interface RecordListProps {
  records: DrinkRecord[];
  onDelete?: (id: string) => void;
  showDate?: boolean;
}

export function RecordList({ records, onDelete, showDate = false }: RecordListProps) {
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  const getDrinkInfo = (type: string) => {
    return DRINK_TYPES.find(d => d.type === type) || DRINK_TYPES[0];
  };

  const handleDelete = (record: DrinkRecord) => {
    if (!onDelete) return;
    
    Alert.alert(
      '記録を削除',
      'この記録を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => onDelete(record.id) },
      ]
    );
  };

  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🥤</Text>
        <Text style={styles.emptyText}>まだ記録がありません</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedRecords}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const drinkInfo = getDrinkInfo(item.type);
        return (
          <View style={styles.item}>
            <View style={[styles.iconContainer, { backgroundColor: drinkInfo.color + '20' }]}>
              <Text style={styles.emoji}>{drinkInfo.emoji}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{drinkInfo.name}</Text>
              <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
            </View>
            <Text style={styles.amount}>{item.amount}ml</Text>
            {onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  time: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
});
