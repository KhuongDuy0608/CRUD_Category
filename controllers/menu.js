let menuModel = require('../schemas/menu'); 

module.exports = {

    GetAllMenu: async function () {
        try {
            // Lấy tất cả các menu chưa bị xóa
            let menuList = await menuModel.find({ isDeleted: false });

            // Chuyển đổi dữ liệu thành một object map với _id là key
            let menuMap = {};
            menuList.forEach(menu => {
                menuMap[menu._id] = {
                    text: menu.text,
                    url: menu.url,
                    children: []
                };
            });

            // Tạo cây menu bằng cách gán các mục con vào `children` của mục cha
            let rootMenus = [];
            menuList.forEach(menu => {
                if (menu.parent) {
                    // Nếu menu có parent, thêm vào children của parent
                    if (menuMap[menu.parent]) {
                        menuMap[menu.parent].children.push(menuMap[menu._id]);
                    }
                } else {
                    // Nếu không có parent => đây là menu cấp cao nhất
                    rootMenus.push(menuMap[menu._id]);
                }
            });

            return rootMenus;  // Trả về cây menu đã xây dựng
        } catch (error) {
            throw new Error(error.message);
        }
    },


    CreateAMenu: async function(text, url, parentId) {
        try {
            let newMenu = new menuModel({
                text: text,
                url: url,
                parent: parentId || null 
            });
            return await newMenu.save();
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
