#!/bin/bash
#
# 861402455 (Even Better Bark)
#

# Thư mục chứa SteamCMD
steamcmd_path="/opt/steamcmd"

# Cấu hình SteamCMD
steamcmd_options="+@NoPromptForPassword 1"

# ID của trò chơi trên Steam
appid="440900"

# Danh sách các mod ID (phân tách bằng dấu phẩy)
modlist="880454836,1396310739,877108545,1159180273,1369743238,1369802940,2050780234,1823412793,2411388528,2097790925,2875171748,3043356654,2897904997,2950216886,2992977512,2641269333,2871328013,2948669907,2974559563,933782986,2818402704,1113901982,1734383367,2284607331,2775631837,2436741811,3036057084,2850232250,2886779102,2677532697,1326031593,2963352186,1976970830,1402835318,2940179165,1705201022,1889798538,2897900107,2905946320,1966733568,2914309509,2799362941,3000822644,3040346361,3086070534,2982469779,2890891645,1224792245"

# File chứa danh sách mod
listfile="modlist.txt"

# Tùy chọn: Tạo thư mục chứa file .pak
mod_folder="mods"

# Tải và sao chép mods
for mod in $(echo $modlist | tr "," "\n")
do
    # Tải mod từ Steam Workshop
    $steamcmd_path/steamcmd.sh $steamcmd_options +login anonymous +workshop_download_item $appid $mod +quit
    
    # Kiểm tra sự tồn tại của thư mục mods, nếu không tồn tại thì tạo mới
    if [ ! -d "$mod_folder" ]; then
        mkdir -p "$mod_folder"
    fi
    
    # Kiểm tra sự tồn tại của mod trước khi sao chép
    if [ -d "$steamcmd_path/steamapps/workshop/content/$appid/$mod" ]; then
        cp "$steamcmd_path/steamapps/workshop/content/$appid/$mod/"*pak "$mod_folder/"
    fi
done

# Xây dựng file modlist.txt
> $listfile
for modname in $(ls "$mod_folder"/*pak)
do
    echo "*$(basename "$modname")" >> $listfile
done
