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
        const right = index % 2 === 1;
        return (
          <View key={node.id} style={[styles.step, right && styles.stepRight]}>
            {index > 0 ? <Connector right={right} /> : null}
            <View style={[styles.label, right ? styles.labelLeft : styles.labelRight]}>
              <ThemedText type="smallBold">{node.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {node.state === 'completed' ? 'Klar' : node.state === 'current' ? 'Pågår' : node.progressPercent ? `${node.progressPercent}% påbörjad` : 'Inte påbörjad'}
              </ThemedText>
            </View>
            <View style={[styles.node, node.state === 'completed' && styles.completedNode, node.state === 'current' && styles.currentNode]}>
              {node.state === 'current' ? (
                <>
                  <View style={styles.currentMarker}>
                    <ThemedText type="smallBold" style={styles.currentMarkerText}>Fortsätt här</ThemedText>
                  </View>
                  <ThemedText style={styles.currentPercent}>{node.progressPercent}%</ThemedText>
                </>
              ) : (
                <ThemedText style={[styles.nodeText, node.state === 'completed' && styles.completedText]}>
                  {node.state === 'completed' ? '✓' : node.title.slice(0, 1)}
                </ThemedText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Connector({ right }: { right: boolean }) {
  return (
    <View style={[styles.connector, right ? styles.connectorRight : styles.connectorLeft]}>
      {Array.from({ length: 7 }).map((_, index) => (
        <View key={index} style={[styles.dot, { top: index * 12, left: right ? index * 12 : 72 - index * 12 }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  path: {
    paddingVertical: Spacing.five,
    gap: Spacing.six,
    minHeight: 720,
  },
  step: {
    minHeight: 92,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stepRight: {
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    width: 132,
    gap: 0,
  },
  labelRight: {
    left: '58%',
  },
  labelLeft: {
    right: '58%',
    alignItems: 'flex-end',
  },
  node: {
    width: 58,
    height: 58,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedNode: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  currentNode: {
    width: 76,
    height: 76,
    backgroundColor: Colors.light.primary,
    borderWidth: 6,
    borderColor: Colors.light.primarySoft,
  },
  nodeText: {
    color: Colors.light.ink,
    fontWeight: 800,
    fontSize: 18,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 26,
  },
  currentPercent: {
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: 18,
  },
  currentMarker: {
    position: 'absolute',
    top: -32,
    borderRadius: Radii.pill,
    backgroundColor: Colors.light.ink,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  currentMarkerText: {
    color: '#FFFFFF',
  },
  connector: {
    position: 'absolute',
    top: -86,
    width: 92,
    height: 84,
  },
  connectorRight: {
    transform: [{ rotate: '20deg' }],
  },
  connectorLeft: {
    transform: [{ rotate: '-20deg' }],
  },
  dot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors.light.border,
  },
});
