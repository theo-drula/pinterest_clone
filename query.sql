SELECT * FROM images;
SELECT * FROM images ORDER BY date DESC;
SELECT * FROM images ORDER BY date DESC LIMIT 3;
SELECT * FROM images WHERE date > '2022-01-01';
SELECT * FROM images WHERE likes > 10;
SELECT * FROM images i JOIN orientations o ON i.orientation = o.id WHERE o.orientation IN ('portrait', 'paysage');
SELECT * FROM images WHERE id_auteur = (SELECT id FROM auteurs WHERE nom = 'Marcel Duchamp');
SELECT * FROM images i JOIN orientations o ON i.orientation = o.id WHERE i.id_auteur = (SELECT id FROM auteurs WHERE nom = 'Marcel Duchamp') AND o.orientation = 'portrait';
SELECT * FROM commentaires WHERE id_image = 28;
SELECT * FROM images ORDER BY likes DESC LIMIT 1;

