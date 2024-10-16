#!/bin/bash

# Đường dẫn tới file steamcmd.sh của bạn
steamcmd_path="/home/container/steamcmd"
appid=322330  # AppID của Don't Starve Together
mods_folder="/home/container/mods"  # Đường dẫn đến thư mục mods

# Đường dẫn đến file modoverrides.lua
modoverrides_file="/home/container/DoNotStarveTogether/config/server/Master/modoverrides.lua"

# Đọc file modoverrides.lua để lấy danh sách các ID mod
modlist=$(grep -oP '(?<=workshop-)[0-9]+' $modoverrides_file)

# Vòng lặp tải từng mod
for mod in $modlist
do
    echo "Đang tải mod ID: $mod"
    
    # Tải mod từ Steam Workshop
    $steamcmd_path/steamcmd.sh +login anonymous +workshop_download_item $appid $mod +quit

    # Thêm thời gian chờ để đảm bảo hệ thống cập nhật mod
    sleep 5  # Đợi 5 giây trước khi kiểm tra

    # Kiểm tra xem thư mục mod đã được tải chưa
    if [ -d "/home/container/Steam/steamapps/workshop/content/$appid/$mod" ]; then
        echo "Đã tải mod $mod. Đang sao chép..."
        
        # Tạo thư mục mod đích nếu chưa tồn tại
        mkdir -p $mods_folder
        
        # Sao chép mod vào thư mục mods với cú pháp workshop-modID
        cp -r "/home/container/Steam/steamapps/workshop/content/$appid/$mod" "$mods_folder/workshop-$mod"
        
        echo "Đã sao chép mod $mod vào thư mục mods."
    else
        echo "Không thể tìm thấy mod $mod sau khi tải. Kiểm tra lại."
    fi
done
echo "Hoàn tất tải các mod."
