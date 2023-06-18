export const newFile = (req, res) => {
    if (req.file)
        res.status(201).send({ data: req.file, message: 'file uploaded' });
    else
        res.status(500).send({ message: 'file not uploaded' });
}

export const newFiles = (req, res) => {
    if (req.files.length)
        res.status(201).send({ message: 'files uploaded' });
    else
        res.status(500).send({ message: 'files not uploaded' });
}