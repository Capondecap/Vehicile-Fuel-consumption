// Web controller for fuel record CRUD — delegates all logic to fuelService.
const fuelService = require('../../services/fuelService');
const { formatDate } = require('../../utils/dateUtils');

const recordController = {
  index(req, res) {
    const records = fuelService.getAllRecords(req.session.userId).map((r) => ({
      ...r,
      dateFormatted: formatDate(r.date),
      efficiency: r.efficiency.toFixed(2),
    }));
    res.render('dashboard/index', {
      records,
      username: req.session.username,
      hasRecords: records.length > 0,
    });
  },

  getCreate(req, res) {
    res.render('records/create', { input: {} });
  },

  postCreate(req, res) {
    const { error } = fuelService.createRecord(req.session.userId, req.body);
    if (error) {
      return res.render('records/create', { error, input: req.body });
    }
    res.redirect('/records');
  },

  getEdit(req, res) {
    const record = fuelService.getRecord(parseInt(req.params.id, 10));
    if (!record || record.userId !== req.session.userId) {
      return res.redirect('/records');
    }
    res.render('records/edit', { record });
  },

  postEdit(req, res) {
    const id = parseInt(req.params.id, 10);
    const existing = fuelService.getRecord(id);
    if (!existing || existing.userId !== req.session.userId) {
      return res.redirect('/records');
    }
    const { error, record } = fuelService.updateRecord(id, req.body);
    if (error) {
      return res.render('records/edit', { error, record: { ...req.body, id } });
    }
    res.redirect('/records');
  },

  postDelete(req, res) {
    const id = parseInt(req.params.id, 10);
    const existing = fuelService.getRecord(id);
    if (existing && existing.userId === req.session.userId) {
      fuelService.deleteRecord(id);
    }
    res.redirect('/records');
  },
};

module.exports = recordController;
