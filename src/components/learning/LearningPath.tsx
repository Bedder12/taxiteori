import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Spacing } from '@/constants/theme';

export type LearningPathNode = {
  id: string;
  title: string;
  progressPercent: number;
  state: 'completed' | 'current' | 'upcoming';
};

type LearningPathProps = {
  nodes: LearningPathNode[];
};

export function LearningPath({ nodes }: LearningPathProps) {
  return (
    <View style={styles.path}>
      {nodes.map((node, index) => {
        const alignRight = index % 2 === 1;
        return (
          <View key={node.id} style={styles.nodeWrap}>
            {index > 0 ? <View style={[styles.connector, alignRight ? styles.connectorRight : styles.connectorLeft]} /> : null}
            <View style={[styles.nodeRow, alignRight && styles.nodeRowRight]}>
              <View style={[styles.label, alignRight && styles.labelRight]}>
                {node.state === 'current' ? (
                  <View style={styles.currentMarker}>
                    <ThemedText type="smallBold" style={styles.currentMarkerText}>Fortsätt här</ThemedText>
                  </View>
                ) : null}
                <ThemedText type="smallBold">{node.title}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{node.progressPercent}% klart</ThemedText>
              </View>
              <View style={[styles.circle, node.state === 'completed' && styles.completed, node.state === 'current' && styles.current]}>
                <ThemedText type="smallBold" style={[styles.circleText, node.state !== 'upcoming' && styles.circleTextActive]}>
                  {node.state === 'completed' ? 'OK' : String(index + 1)}
                </ThemedText>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  path: {
    gap: Spacing.four,
    paddingVertical: Spacing.two,
  },
  nodeWrap: {
    minHeight: 84,
  },
  connector: {
    position: 'absolute',
    top: -34,
    width: '42%',
    height: 58,
    borderColor: Colors.light.borderStrong,
    borderTopWidth: 2,
  },
  connectorLeft: {
    left: '18%',
    borderRightWidth: 2,
    borderTopRightRadius: 36,
  },
  connectorRight: {
    right: '18%',
    borderLeftWidth: 2,
    borderTopLeftRadius: 36,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.three,
  },
  nodeRowRight: {
    flexDirection: 'row-reverse',
  },
  label: {
    maxWidth: '64%',
    gap: Spacing.one,
  },
  labelRight: {
    alignItems: 'flex-end',
  },
  circle: {
    width: 62,
    height: 62,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.borderStrong,
  },
  completed: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  current: {
    backgroundColor: Colors.light.primarySoft,
    borderColor: Colors.light.primary,
  },
  circleText: {
    color: Colors.light.textSecondary,
  },
  circleTextActive: {
    color: Colors.light.primaryStrong,
  },
  currentMarker: {
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  currentMarkerText: {
    color: '#FFFFFF',
  },
});
