import { StyleSheet, View } from 'react-native';

import { Colors, Radii } from '@/constants/theme';

type LearningIllustrationProps = {
  kind: 'book' | 'exam' | 'map' | 'wheel' | 'safety' | 'road' | 'car' | 'person';
  size?: 'small' | 'large';
};

export function LearningIllustration({ kind, size = 'large' }: LearningIllustrationProps) {
  return (
    <View style={[styles.tile, size === 'small' && styles.smallTile]}>
      {kind === 'book' ? (
        <>
          <View style={styles.bookPage} />
          <View style={styles.bookCover} />
        </>
      ) : null}
      {kind === 'exam' ? (
        <>
          <View style={styles.clip} />
          <View style={styles.examSheet}>
            <View style={styles.examLine} />
            <View style={styles.examLine} />
            <View style={styles.examLine} />
          </View>
        </>
      ) : null}
      {kind === 'map' ? (
        <>
          <View style={styles.mapPaper} />
          <View style={styles.mapRoute} />
          <View style={styles.mapPin} />
        </>
      ) : null}
      {kind === 'wheel' ? (
        <View style={styles.wheel}>
          <View style={styles.wheelHub} />
          <View style={[styles.wheelSpoke, styles.wheelSpokeOne]} />
          <View style={[styles.wheelSpoke, styles.wheelSpokeTwo]} />
          <View style={[styles.wheelSpoke, styles.wheelSpokeThree]} />
        </View>
      ) : null}
      {kind === 'safety' ? (
        <>
          <View style={styles.beltPlate} />
          <View style={styles.beltSlash} />
          <View style={styles.beltLatch} />
        </>
      ) : null}
      {kind === 'road' ? (
        <>
          <View style={styles.road} />
          <View style={styles.roadLine} />
          <View style={styles.roadPoleLeft} />
          <View style={styles.roadPoleRight} />
        </>
      ) : null}
      {kind === 'car' ? (
        <>
          <View style={styles.carBody} />
          <View style={styles.carTop} />
          <View style={[styles.carWheel, styles.carWheelLeft]} />
          <View style={[styles.carWheel, styles.carWheelRight]} />
        </>
      ) : null}
      {kind === 'person' ? (
        <>
          <View style={styles.personHead} />
          <View style={styles.personBody} />
          <View style={styles.personBag} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 80,
    borderRadius: Radii.large,
    backgroundColor: Colors.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  smallTile: {
    width: 72,
    height: 58,
  },
  bookPage: {
    width: 36,
    height: 42,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 16,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: '25%',
    transform: [{ rotate: '-3deg' }],
  },
  bookCover: {
    width: 38,
    height: 44,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    right: '25%',
    transform: [{ rotate: '3deg' }],
  },
  clip: {
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.ink,
    position: 'absolute',
    top: 17,
    zIndex: 2,
  },
  examSheet: {
    width: 44,
    height: 54,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  examLine: {
    width: 20,
    height: 5,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
  },
  mapPaper: {
    width: 58,
    height: 44,
    backgroundColor: '#FFFFFF',
    transform: [{ skewX: '-10deg' }],
  },
  mapRoute: {
    width: 42,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    transform: [{ rotate: '-18deg' }],
  },
  mapPin: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: Colors.light.ink,
    position: 'absolute',
    right: 26,
    top: 25,
  },
  wheel: {
    width: 58,
    height: 58,
    borderRadius: 999,
    borderWidth: 8,
    borderColor: Colors.light.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelHub: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
  },
  wheelSpoke: {
    width: 6,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.light.ink,
    position: 'absolute',
  },
  wheelSpokeOne: { top: 13 },
  wheelSpokeTwo: { transform: [{ rotate: '120deg' }], top: 24, left: 17 },
  wheelSpokeThree: { transform: [{ rotate: '240deg' }], top: 24, right: 17 },
  beltPlate: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  beltSlash: {
    position: 'absolute',
    width: 9,
    height: 54,
    borderRadius: 8,
    backgroundColor: Colors.light.primary,
    transform: [{ rotate: '-38deg' }],
  },
  beltLatch: {
    position: 'absolute',
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.ink,
    transform: [{ rotate: '38deg' }],
  },
  road: {
    width: 16,
    height: 58,
    backgroundColor: Colors.light.ink,
    borderRadius: 3,
  },
  roadLine: {
    position: 'absolute',
    width: 3,
    height: 42,
    backgroundColor: Colors.light.taxi,
    borderRadius: 2,
  },
  roadPoleLeft: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
    left: 22,
  },
  roadPoleRight: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
    right: 22,
  },
  carBody: {
    width: 58,
    height: 22,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
    marginTop: 16,
  },
  carTop: {
    position: 'absolute',
    width: 32,
    height: 18,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Colors.light.primary,
    top: 24,
  },
  carWheel: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.ink,
    bottom: 18,
  },
  carWheelLeft: { left: 28 },
  carWheelRight: { right: 28 },
  personHead: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: Colors.light.ink,
    position: 'absolute',
    top: 18,
  },
  personBody: {
    width: 46,
    height: 34,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: Colors.light.primary,
    position: 'absolute',
    bottom: 14,
  },
  personBag: {
    width: 14,
    height: 18,
    borderRadius: 4,
    backgroundColor: Colors.light.taxi,
    position: 'absolute',
    right: 27,
    bottom: 18,
  },
});
