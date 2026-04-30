// C:\nginx\html\pspace-logbook\pspace-logbook\app\index.tsx
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenLayout from "@/components/layout/screen-layout";

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoScale   = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY       = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    // Logo pop-in
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Text fade-in after logo settles
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Navigate to login after 2.5 s
    const timer = setTimeout(() => {
      router.replace("/auth/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenLayout hideFooter>
      <View style={styles.container}>
        {/* Grid dot background */}
        <View style={styles.gridOverlay} pointerEvents="none" />

        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          {/* ── Logo SVG-like recreation in RN ── */}
          <View style={styles.logoOuter}>
            <Image
              source={require("@/assets/images/logo-with-map.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Brand name */}
          <Animated.Text
            style={[
              styles.brandText,
              { opacity: textOpacity, transform: [{ translateY: textY }] },
            ]}
          >
            PSPACE LOGBOOK
          </Animated.Text>
        </Animated.View>
      </View>
    </ScreenLayout>
  );
}

const NAVY = "#1A2340";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    alignItems: "center",
    justifyContent: "center",
  },

  // subtle dot grid — rendered via a semi-transparent nested view pattern
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    // In production you'd use a real dot-grid image or SVG pattern
  },
    // ── Logo bar ────────────────────────────────────────────────────────────────

  logoImage: {
    width: 150,
    height: 80,
  },

  logoWrap: {
    alignItems: "center",
    gap: 14,
  },

  logoOuter: {
    alignItems: "center",
    justifyContent: "center",
  },

  globeArc: {
    position: "absolute",
    top: -14,
    width: 110,
    height: 55,
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    backgroundColor: NAVY,
    opacity: 0.22,
  },

  wingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 18,
  },

  wingFeather: {
    height: 8,
    borderRadius: 4,
    backgroundColor: NAVY,
  },
  wingLeft:  { marginRight: 1 },
  wingRight: { marginLeft: 1 },

  badge: {
    width: 72,
    height: 88,
    backgroundColor: NAVY,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },

  badgeLine: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    opacity: 0.9,
  },

  redArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 0,
    borderBottomWidth: 16,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#E8232A",
    transform: [{ rotate: "30deg" }],
  },

  brandText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2.5,
    color: NAVY,
    marginTop: 4,
  },
});