# tv-debloat — Next 4K Google TV stick

Bu klasör bulut oturumunda hazırlandı; TV'ye yalnızca **sizin bilgisayarınızdan** ulaşılabilir.
Sırayla çalıştırın (macOS/Linux terminali; Windows'ta Git Bash veya WSL):

    cd tv-debloat
    ./00-baglan.sh                 # adb kur/bağlan, TV kimliğini yazdır
    ./01-yedekle.sh                # yedek + RAM ölçümü + restore.sh/restore.ps1 başlat
    ./kapat.sh "telemetri" com.google.android.feedback com.android.tv.feedbackconsent ...   # ≤10 paket
    ./kontrol.sh                   # tuşlar + ekran görüntüleri (ekran/ klasörü)
    ./04-anaekran.sh               # FLauncher kurulu olduktan sonra
    ./03-hizlandir.sh              # animasyon 0.5, trim-caches, reboot, önce/sonra tablosu

Her şeyi geri al:  `./restore.sh`   (Windows: `.\restore.ps1`)
Son partiyi geri al: `tail -n 10 kapatilanlar.txt | xargs -n1 adb shell pm enable --user 0`

Daha iyisi: aynı istemi Claude Desktop uygulamasında ya da bilgisayarınızda bu klasörde `claude remote-control`
komutuyla açılan oturumda verin; o zaman komutları ben çalıştırıp ekran görüntülerini kendim kontrol ederim.
