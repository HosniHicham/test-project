const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SUPABASE_URL = 'https://jjrisfyotyryanhbsvlz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_t7kVxzmOtz16C95U_B52FA_AJl_WK-h';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// مسار إضافة عقار جديد مع الوسائط
app.post('/api/add-idea', upload.single('media'), async (req, res) => {
    try {
        const { idea } = req.body;
        const file = req.file;
        let mediaUrl = "";

        if (file) {
            const fileName = `${Date.now()}_${file.originalname}`;
            const { error: uploadError } = await supabase.storage
                .from('test_media')
                .upload(fileName, file.buffer, { contentType: file.mimetype });

            if (uploadError) return res.status(400).json({ success: false, error: uploadError.message });

            const { data: publicURLData } = supabase.storage
                .from('test_media')
                .getPublicUrl(fileName);

            mediaUrl = publicURLData.publicUrl;
        }

        let imageUrl = file && file.mimetype.startsWith('image') ? mediaUrl : "";
        let videoUrl = file && file.mimetype.startsWith('video') ? mediaUrl : "";

        const { error: dbError } = await supabase
            .from('test_messages')
            .insert([{ message: idea, image_url: imageUrl, video_url: videoUrl }]);

        if (dbError) return res.status(400).json({ success: false, error: dbError.message });

        res.json({ success: true, message: 'تم حفظ العقار بنجاح!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// مسار جلب العقارات المسجلة
app.get('/api/get-ideas', async (req, res) => {
    try {
        const { data, error } = await supabase.from('test_messages').select('*');
        if (error) return res.status(400).json({ success: false, error: error.message });
        res.json({ success: true, ideas: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// مسار حذف عقار مع حذف الملف المرتبط به من Supabase Storage تلقائياً
app.delete('/api/delete-idea/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. جلب بيانات العقار أولاً لمعرفة رابط الملف (صورة أو فيديو)
        const { data: itemData, error: fetchError } = await supabase
            .from('test_messages')
            .select('image_url, video_url')
            .eq('id', id)
            .single();

        if (fetchError) {
            return res.status(404).json({ success: false, error: 'العقار غير موجود' });
        }

        // تحديد الرابط الموجود (سواء كان صورة أو فيديو)
        const mediaUrl = itemData.image_url || itemData.video_url;

        // 2. إذا كان هناك رابط ملف، نقوم باستخراج اسم الملف وحذفه من الـ Storage
        if (mediaUrl) {
            const urlParts = mediaUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            if (fileName) {
                const { error: storageError } = await supabase.storage
                    .from('test_media')
                    .remove([fileName]);
                
                if (storageError) {
                    console.error('خطأ في حذف الملف من الـ Storage:', storageError.message);
                }
            }
        }

        // 3. حذف السطر من قاعدة البيانات
        const { error: dbError } = await supabase
            .from('test_messages')
            .delete()
            .eq('id', id);

        if (dbError) return res.status(400).json({ success: false, error: dbError.message });

        res.json({ success: true, message: 'تم حذف العقار والملف المرتبط به بنجاح من التخزين!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
