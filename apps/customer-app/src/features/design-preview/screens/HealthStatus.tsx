import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Action,
  Card,
  Copy,
  DemoNote,
  Dots,
  Heading,
  Icon,
  IconButton,
  Tile,
  s,
} from '../components/UI';
import { WellnessIllustration } from '../components/Illustrations';
import { statusSlides } from '../data/mock';
import { colors as c, designRoutes } from '../tokens';
export default function HealthStatus() {
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && windowWidth >= 900;
  const [width, setWidth] = useState(Math.min(windowWidth, desktop ? 760 : 430));
  const [index, setIndex] = useState(0);
  const ref = useRef<ScrollView>(null);
  const go = (i: number) => {
    setIndex(i);
    ref.current?.scrollTo({ x: i * width, animated: true });
  };
  return (
    <View
      style={st.root}
      onLayout={(e) => setWidth(Math.min(e.nativeEvent.layout.width, desktop ? 760 : 430))}
    >
      <View style={st.header}>
        <IconButton
          name="back"
          label="Back to home"
          onPress={() => router.replace(designRoutes.home)}
        />
        <Heading size={18} style={s.flex}>
          Your Health Status
        </Heading>
      </View>
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        style={[s.flex, desktop && st.desktopCarousel]}
      >
        {statusSlides.map((slide, i) => (
          <ScrollView
            key={slide.title}
            style={{ width }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={st.slide}
          >
            <View style={st.counter}>
              <Copy bold size={16}>
                {i + 1} / 4
              </Copy>
            </View>
            <WellnessIllustration kind={slide.art} />
            <Heading size={i === 0 ? 38 : 29} style={st.title}>
              {slide.title}
            </Heading>
            <Copy size={17} color={c.muted} style={st.description}>
              {slide.description}
            </Copy>
            {i < 3 ? (
              <View style={st.quote}>
                <View style={st.quoteIcon}>
                  <Copy size={55} color={c.green} bold>
                    “
                  </Copy>
                </View>
                <Copy size={17} color="#294559" style={s.flex}>
                  {slide.quote}
                </Copy>
              </View>
            ) : (
              <View style={st.habits}>
                {[
                  ['moon', 'Keep your bedtime consistent'],
                  ['activity', 'Take a short walk today'],
                  ['calendar', 'Check in again tomorrow'],
                ].map(([icon, text]) => (
                  <View style={[s.row, { paddingVertical: 7 }]} key={text}>
                    <Tile name={icon} tone="green" size={34} />
                    <Copy size={15} style={s.flex}>
                      {text}
                    </Copy>
                  </View>
                ))}
              </View>
            )}
            <DemoNote text="Sample wellness status · Not medical advice" />
          </ScrollView>
        ))}
      </ScrollView>
      <View style={[st.footer, desktop && st.desktopFooter]}>
        <Dots count={4} index={index} onChange={go} />
        <Action
          style={st.next}
          onPress={() => (index === 3 ? router.replace(designRoutes.home) : go(index + 1))}
        >
          <Copy size={20} bold color="white">
            {index === 3 ? 'Done' : 'Next'}
          </Copy>
          <Icon name="arrow" size={24} color="white" />
        </Action>
      </View>
    </View>
  );
}
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'white' },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 35,
  },
  slide: { paddingHorizontal: 19, paddingTop: 9, paddingBottom: 10 },
  counter: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 25,
    backgroundColor: '#f0f2f6',
    marginBottom: 14,
  },
  title: { color: c.green, textAlign: 'center', marginTop: 15 },
  description: { textAlign: 'center', marginTop: 12, marginBottom: 18, lineHeight: 25 },
  quote: {
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quoteIcon: {
    height: 54,
    width: 54,
    backgroundColor: 'white',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habits: { backgroundColor: '#eff6ff', borderRadius: 20, padding: 14 },
  footer: { paddingHorizontal: 19, paddingBottom: 12 },
  next: { backgroundColor: '#19465f', borderRadius: 40, gap: 20 },
  desktopCarousel: { width: 760, alignSelf: 'center' },
  desktopFooter: { width: 760, alignSelf: 'center' },
});
