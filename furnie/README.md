# furnie

# Các bước làm việc với github

B1: Chuyển sang branch develop
B2: Sử dụng lệnh git pull để pull toàn bộ code mới từ branch develop nếu có
B3: Từ branch develop tạo 1 branch mới bằng câu lệnh git checkout -b ten-issuse develop
B4: Viết code lưu lại
B5: Đẩy code lên git bằng branch được tạo ở bước 2 (Chú ý commit phải có #n, n là số ở trên issuse)
B6: Lên git online merge code được push lên từ branch ở bước 2 vào branch develop
B7: Xóa branch ở bước 2 trên local bằng lệnh git branch -d ten-branch
B8: Xóa branch ở bước 2 trên online bằng lệnh git push origin -d ten-branch
