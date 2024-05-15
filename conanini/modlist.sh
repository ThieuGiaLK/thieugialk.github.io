#!/bin/bash
#
# 861402455 (Even Better Bark)
#
# Thư mục chứa SteamCMD
steamcmd_path="/home/container/steamcmd"

# ID của trò chơi trên Steam
appid="440900"

# Danh sách các mod ID (phân tách bằng dấu phẩy)
modlist="880454836,1396310739"

# File chứa danh sách mod
listfile="/home/container/ConanSandbox/Mods/modlist.txt"

# Tùy chọn: Tạo thư mục chứa file .pak
mod_folder="/home/container/ConanSandbox/Mods"

# Tải và sao chép mods
for mod in $(echo $modlist | tr "," "\n")
do
    # Tải mod từ Steam Workshop
    $steamcmd_path/steamcmd.sh +login anonymous +workshop_download_item $appid $mod +quit
        
    # Kiểm tra sự tồn tại của mod trước khi sao chép
    if [ -d "/home/container/Steam/steamapps/workshop/content/$appid/$mod" ]; then
        cp "/home/container/Steam/steamapps/workshop/content/$appid/$mod/"*pak "$mod_folder/"
    fi
done

# Xây dựng file modlist.txt
> $listfile
for modname in $(ls "$mod_folder"/*pak)
do
    echo "*$(basename "$modname")" >> $listfile
done
# Đóng script sau khi hoàn thành
## install end
echo "---------------------------------------------------------"
echo "Installation MOD completed... Chờ 10 phút Server đang lên"
exit 0
