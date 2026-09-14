import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, shadows } from '../core/theme/colors';
import { typography } from '../core/theme/typography';
import { BookOpen, Calculator, FlaskConical, Globe, Activity } from 'lucide-react-native';

interface SubjectCardProps {
  id: string;
  name: string;
  stream: string;
  gradeLevel: number;
  onPress: (id: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ id, name, stream, gradeLevel, onPress }) => {
  // Simple scale animation on press
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Dynamically select an icon based on subject name
  const getIcon = () => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('math')) return <Calculator color={colors.primary} size={32} />;
    if (nameLower.includes('phys')) return <Activity color={colors.primary} size={32} />;
    if (nameLower.includes('chem')) return <FlaskConical color={colors.primary} size={32} />;
    if (nameLower.includes('geo')) return <Globe color={colors.primary} size={32} />;
    return <BookOpen color={colors.primary} size={32} />;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onPress(id)}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.badge}>Grade {gradeLevel} • {stream}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.primary + '15', // 15% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    marginBottom: 6,
  },
  badge: {
    ...typography.caption,
    backgroundColor: colors.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  }
});
