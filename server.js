const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const SUPABASE_URL = 'https://jjrisfyotyryanhbsvlz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_t7kVxzmOtz16C95U_B52FA_AJl_WK-h';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.post('/api/add-idea', async (req, res) => {
    try {
        const { idea, imageUrl, videoUrl } = req.body;
        const { data, error } = await supabase
            .from('test_messages')
            .insert([{ message: idea, image_url: imageUrl, video_url: videoUrl }]);

        if (error) return res.status(400).json({ success: false, error: error.message });
        res.json({ success: true, message: 'تم حفظ العقار بنجاح!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/get-ideas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('test_messages')
            .select('*');

        if (error) return res.status(400).json({ success: false, error: error.message });
        res.json({ success: true, ideas: data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
