#!/bin/bash

# Đường dẫn đến file modoverrides.lua
modoverrides_file="/home/container/DoNotStarveTogether/config/server/Master/modoverrides.lua"

# Đường dẫn đến file dedicated_server_mods_setup.lua
dedicated_server_mods_setup_file="/home/container/mods/dedicated_server_mods_setup.lua"

# Đường dẫn đến file cluster_token.txt
cluster_token_file="/home/container/DoNotStarveTogether/config/server/cluster_token.txt"
sv_token=$SERVER_TOKEN
# Ghi cluster token vào file
echo "Cập nhật cluster token..."
echo "$SERVER_TOKEN" > "$cluster_token_file"
echo "Đã cập nhật cluster token thành công"

# Đọc file modoverrides.lua để lấy danh sách các ID mod
modlist=$(grep -oP '(?<=workshop-)[0-9]+' $modoverrides_file)

# Xóa nội dung cũ của file dedicated_server_mods_setup.lua
> $dedicated_server_mods_setup_file

# Ghi các ModID vào file dedicated_server_mods_setup.lua theo cú pháp ServerModSetup("ModID")
for modid in $modlist; do
    echo "ServerModSetup(\"$modid\")" >> $dedicated_server_mods_setup_file
done

echo "Đã ghi các ModID vào file dedicated_server_mods_setup.lua"
echo "Hoàn tất tải các mod."

# Tính toán port cho Master và Caves
server_port=11016
cave_port=$((server_port + 2))

# Kiểm tra quá trình tải có thành công không
if [ $? -eq 0 ]; then
    echo "Tải mod thành công. Bắt đầu khởi động server..."
    
    # Đường dẫn đến SteamCMD và thư mục cài đặt
    steamcmd_dir="/home/container/steamcmd"
    install_dir="/home/container/"
    cluster_name="server"
    dontstarve_dir="/home/container/DoNotStarveTogether/config/"

    # Hàm kiểm tra lỗi
    function fail() {
        echo Error: "$@" >&2
        exit 1
    }

    # Chuyển đến thư mục bin64
    cd "$install_dir/bin64" || fail

    # Thiết lập các thông số chung cho server
    run_shared=(./dontstarve_dedicated_server_nullrenderer_x64)
    run_shared+=(-console)

    # Khởi động shard Caves (ép chạy trên core 2)
    echo "Khởi động shard Caves trên core 2..."
    taskset -c 1 "${run_shared[@]}" \
        -port "$cave_port" \
        -persistent_storage_root /home/container/DoNotStarveTogether \
        -cluster server -conf_dir config -shard Caves \
        | sed 's/^/Caves:  /' &

    # Khởi động shard Master (ép chạy trên core 3)
    echo "Khởi động shard Master trên core 3..."
    taskset -c 2 "${run_shared[@]}" \
        -port "$server_port" \
        -persistent_storage_root /home/container/DoNotStarveTogether \
        -cluster server -conf_dir config -shard Master \
        | sed 's/^/Master: /'

else
    echo "Có lỗi xảy ra khi tải mod. Dừng quá trình khởi động server."
    exit 1  # Thoát nếu quá trình tải mod thất bại
fi