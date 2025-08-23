package com.cleantech.app.services

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.cleantech.app.R
import com.cleantech.app.ui.main.MainActivity
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class MessagingService : FirebaseMessagingService() {
override fun onMessageReceived(msg: RemoteMessage) {
msg.notification?.let { push(it.title ?: "CleanTech", it.body ?: "") }
}

private fun push(title: String, body: String) {
val intent = Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
val pi = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE)
val chId = "cleantech_channel"
val sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)

val nb = NotificationCompat.Builder(this, chId)
.setSmallIcon(R.drawable.ic_notification)
.setContentTitle(title)
.setContentText(body)
.setAutoCancel(true)
.setSound(sound)
.setContentIntent(pi)

val nm = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
nm.createNotificationChannel(NotificationChannel(chId, "CleanTech", NotificationManager.IMPORTANCE_HIGH))
}
nm.notify(System.currentTimeMillis().toInt(), nb.build())
}
}