# Add project specific ProGuard rules here.

# React Native Vector Icons & Reanimated keep rules
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.oblador.vectoricons.** { *; }
-keep class expo.modules.font.** { *; }

# Keep raw resources and font assets
-keepclassmembers class * {
    *** *Font*(...);
}
