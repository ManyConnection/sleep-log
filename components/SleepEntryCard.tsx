import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SleepEntry } from '../types/sleep';
import { formatDuration, formatTime, formatDate, calculateSleepDuration } from '../utils/sleepScore';
import { Ionicons } from '@expo/vector-icons';
import { saveSleepEntry, deleteSleepEntry } from '../utils/storage';

interface SleepEntryCardProps {
  entry: SleepEntry;
  onUpdate: () => void;
}

export function SleepEntryCard({ entry, onUpdate }: SleepEntryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(entry.notes);
  
  const duration = entry.wakeTime 
    ? calculateSleepDuration(entry.sleepTime, entry.wakeTime)
    : null;
  
  const handleSaveNotes = async () => {
    await saveSleepEntry({ ...entry, notes });
    setIsEditing(false);
    onUpdate();
  };
  
  const handleDelete = () => {
    Alert.alert(
      '削除確認',
      'この睡眠記録を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteSleepEntry(entry.id);
            onUpdate();
          },
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(entry.sleepTime)}</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Ionicons name="moon" size={16} color="#6366F1" />
          <Text style={styles.timeLabel}>就寝</Text>
          <Text style={styles.timeValue}>{formatTime(entry.sleepTime)}</Text>
        </View>
        
        <Ionicons name="arrow-forward" size={16} color="#D1D5DB" />
        
        <View style={styles.timeItem}>
          <Ionicons name="sunny" size={16} color="#F59E0B" />
          <Text style={styles.timeLabel}>起床</Text>
          <Text style={styles.timeValue}>
            {entry.wakeTime ? formatTime(entry.wakeTime) : '--:--'}
          </Text>
        </View>
        
        {duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.notesSection}>
        {isEditing ? (
          <View style={styles.notesEditContainer}>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="メモを入力（夢の内容など）"
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View style={styles.notesButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setNotes(entry.notes);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotes}>
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.notesDisplay}
            onPress={() => setIsEditing(true)}
          >
            {entry.notes ? (
              <Text style={styles.notesText}>{entry.notes}</Text>
            ) : (
              <Text style={styles.notesPlaceholder}>
                <Ionicons name="create-outline" size={14} color="#9CA3AF" />
                {' '}メモを追加
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeItem: {
    alignItems: 'center',
    gap: 4,
  },
  timeLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  durationBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  notesSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  notesDisplay: {
    padding: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  notesPlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  notesEditContainer: {
    gap: 8,
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  notesButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
