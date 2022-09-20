const db = require('#@/utils/mongoose');
const logger = require('#@/utils/logger');

const onDeath = async (signal, err) => {
  if (signal) {
    logger.warn(`${signal} event`);
  }

  if (err) {
    logger.error(err);
  }

  await db.globalDisconnect();

  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

module.exports = { onDeath };
