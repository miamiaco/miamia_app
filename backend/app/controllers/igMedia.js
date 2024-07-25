const prisma = require('../prisma/client');

const getAllMediaFromDb = async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  try {
    const media = await prisma.iG_Media.findMany({
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true,
        caption: true,
        media_product_type: true,
        media_type: true,
        permalink: true,
        ig_business_account_username: true,
        media_url: true,
        thumbnail_url: true,
      },
    });

    const mediaWithBigIntAsString = media.map(item => ({
      ...item,
      id: item.id.toString(), 
    }));


    res.json(mediaWithBigIntAsString);
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: 'Failed to fetch media', details: error.message });
  }
};

module.exports = { getAllMedia: getAllMediaFromDb  };
