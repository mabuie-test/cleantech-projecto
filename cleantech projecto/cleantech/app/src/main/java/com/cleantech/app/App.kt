package com.cleantech.app

import android.app.Application
import org.maplibre.gl.config.Environment

class App : Application() {
override fun onCreate() {
super.onCreate()
Environment.getInstance().applicationContext = applicationContext
instance = this
}
companion object { lateinit var instance: App; private set }
}