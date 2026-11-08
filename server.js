const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();

app.use(express.json());

// معلومات الاتصال الخاصة بك
const SUPABASE_URL = 'https://jjrisfyotyryanhbsvlz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_t7kVxzmOtz16C95U_B52FA_AJl_WK-h';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// نقطة نهاية (API Endpoint) لتجربة إضافة منزل أو عقار لقاعدة البيانات
app.post('/api/add-property', async (req, res) => {
    try {
        const propertyData = {
            title: req.body.title || 'شقة F3 مجهزة في حي الصنوبر',
            price: req.body.price || 35000,
            city: req.body.city || 'وهران',
            type: req.body.type || 'كراء',
            rooms: 3
        };

        const { data, error } = await supabase
            .from('properties') // اسم الجدول في قاعدة البيانات
            .insert([propertyData]);

        if (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({ success: true, message: 'تم إرسال العقار بنجاح إلى Supabase!', data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// تشغيل السيرفر المحلي
const PORT = process.ographystyle || 3000;
app.listen(3000, () => {
    console.log('🚀 السيرفر يشتغل بكفاءة على المنفذ 3000...');
});
