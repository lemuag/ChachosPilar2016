#!/bin/bash
#ismaro3 - 5 Agosto 2015
#Compila y firma la aplicacion lista para subirse a la Play Store
#NOTA: NO OLVIDAR cambiar el numero de version en los ficheros de la app

rm -rf platforms/android/build/outputs/apk/*.apk
cordova build --release android
cd platforms/android/build/outputs/apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore sanLorenzo15.keystore android-release-unsigned.apk sanLorenzo15
~/android-sdk-linux/build-tools/22.0.1/zipalign -v 4 android-release-unsigned.apk sanLorenzo15_signed.apk
