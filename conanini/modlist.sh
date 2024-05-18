#!/bin/bash
#
# 861402455 (Even Better Bark)
#
# Thư mục chứa SteamCMD
steamcmd_path="/home/container/steamcmd"

# ID của trò chơi trên Steam
appid="440900"

# Danh sách các mod ID (phân tách bằng dấu phẩy)
modlist="864199675,880454836"

# File chứa danh sách mod
listfile="/home/container/ConanSandbox/Mods/modlist.txt"

# Kiểm tra nếu modlist trống
if [ -z "$modlist" ]; then
    # Xóa file modlist.txt nếu tồn tại
    if [ -f "$listfile" ]; then
        rm "$listfile"
    fi
    echo "Modlist is empty. File modlist.txt has been deleted."
    echo "---------------------------------------------------------"
	echo "Installation MOD completed... Chờ 10 Đến 15 phút Server đang lên"
    exit 0
fi

# Tải và sao chép mods
for mod in $(echo $modlist | tr "," "\n")
do
    # Tải mod từ Steam Workshop
    $steamcmd_path/steamcmd.sh +login anonymous +workshop_download_item $appid $mod +quit
done

# Xây dựng file modlist.txt
> $listfile
for mod in $(echo $modlist | tr "," "\n")
do
    mod_path="/home/container/Steam/steamapps/workshop/content/$appid/$mod"
    for modname in $(ls "$mod_path"/*.pak 2>/dev/null)
    do
        echo "$mod_path/$(basename "$modname")" >> $listfile
    done
done

# Đóng script sau khi hoàn thành
## install end
echo "---------------------------------------------------------"
echo "Installation MOD completed... Chờ 10 Đến 15 phút Server đang lên"
exit 0
