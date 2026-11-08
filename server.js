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
    } catch (err) { // تم تصحيحها من elsif إلى catch
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/get-ideas', async (req, res) => {
    try {
        const { data, error } = await supabase.from('test_messages').select('*');
        if (error) return res.status(400).json({ success: false, error: error.message });
        res.json({ success: true, ideas: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
