// Latest temporal polyfill
import { Temporal as TemporalPolyfill } from 'https://esm.run/@js-temporal/polyfill';
if (!globalThis.Temporal) globalThis.Temporal = TemporalPolyfill;

const cardData = [
  {
    key: 'gold',
    date: '2014-09-06',
  },
  {
    key: 'bronze',
    date: '2015-07-28',
  },
  {
    key: 'arrival',
    label: 'Days since arrival',
    date: '2016-01-15',
  },
  {
    key: 'application',
    label: 'Days since application',
    date: '2024-11-26',
  },
];

const singleCardData = {
  key: 'deadline',
  date: '2027-09-23',
};

// const singleCardData = {
//   key: 'test',
//   date: '2025-06-05',
// };

const formatTimeDifference = (dateString) => {
  const targetInstant = Temporal.PlainDateTime.from(dateString);
  const nowInstant = Temporal.Now.plainDateTimeISO();
  const duration = targetInstant.since(nowInstant);
  const sign = duration.sign;

  const roundedAbsDuration = duration
    .round({
      roundingMode: 'floor',
      relativeTo: nowInstant,
      smallestUnit: 'seconds',
      largestUnit: 'years',
    })
    .abs();

  let displayedDurationRoundConfig;

  switch (true) {
    case roundedAbsDuration.years > 0:
    case roundedAbsDuration.months > 0:
    case roundedAbsDuration.days > 7:
      displayedDurationRoundConfig = {
        smallestUnit: 'days',
        largestUnit: 'years',
      };
      break;
    case roundedAbsDuration.days > 2:
      displayedDurationRoundConfig = {
        smallestUnit: 'hours',
        largestUnit: 'days',
      };
      break;
    case roundedAbsDuration.days > 0:
      displayedDurationRoundConfig = {
        smallestUnit: 'minutes',
        largestUnit: 'days',
      };
      break;
    default:
      displayedDurationRoundConfig = {
        smallestUnit: 'seconds',
        largestUnit: 'hours',
      };
  }

  const displayedDuration = roundedAbsDuration.round({
    roundingMode: 'floor',
    relativeTo: nowInstant,
    ...displayedDurationRoundConfig,
  });

  const longDtf = new Intl.DurationFormat('en', { style: 'long' });

  const dateDuration = Temporal.Duration.from({
    years: roundedAbsDuration.years,
    months: roundedAbsDuration.months,
    days: roundedAbsDuration.days,
  });

  const secondDuration = Temporal.Duration.from({
    hours: roundedAbsDuration.hours,
    minutes: roundedAbsDuration.minutes,
    seconds: roundedAbsDuration.seconds,
  });

  const digitalDtf = new Intl.DurationFormat('en', { style: 'digital' });

  return {
    sign,
    formatted: longDtf.format(displayedDuration.abs()),
    formattedDate: longDtf.format(dateDuration.abs()),
    formattedTime: digitalDtf.format(secondDuration.abs()),
  };
};

const updateElementById = (id, innerHTML) => {
  const element = document.getElementById(id);
  if (element && element.innerHTML !== innerHTML) element.innerHTML = innerHTML;
};

const createSmallCard = (card) => {
  // requestAnimationFrame loop and initiation
  const headerId = `${card.key}-header`;
  const mainTextId = `${card.key}-text`;

  const updateTimeDifference = () => {
    // Update header text according to time diff
    const { sign, formatted } = formatTimeDifference(card.date);

    const headerText = `Days ${sign < 0 ? 'from' : 'to'} ${card.date}`;
    const mainText = `${formatted}
            ${sign < 0 ? ` <span class="text-gray-400 text-sm" id="${card.key}-subtext">ago</span>` : ''}`;

    updateElementById(headerId, headerText);
    updateElementById(mainTextId, mainText);
    requestAnimationFrame(updateTimeDifference);
  };

  requestAnimationFrame(updateTimeDifference);

  const label = card.label
    ? `<h3 class="font-semibold text-lg mb-2">${card.label}</h3>`
    : `<h3 class="font-semibold text-lg mb-2" id="${headerId}">undefined</h3>`;

  return `
        <div class="bg-white shadow-md rounded-lg p-4">
            ${label}
            <p class="text-md" id="${mainTextId}">
            undefined
            </p>
        </div>
    `;
};

const createBigCard = (card) => {
  // requestAnimationFrame loop and initiation
  const headerId = `${card.key}-header`;
  const mainTextId = `${card.key}-text`;
  const mainText2Id = `${card.key}-text2`;

  const updateTimeDifference = () => {
    // Update header text according to time diff
    const { sign, formattedDate, formattedTime } = formatTimeDifference(card.date);

    const headerText = `Days ${sign < 0 ? 'from' : 'to'} ${card.date}`;
    const mainText = formattedDate;
    const mainText2 = `${formattedTime}
            ${sign < 0 ? ` <span class="text-gray-400 text-sm" id="${card.key}-subtext">ago</span>` : ''}`;

    updateElementById(headerId, headerText);
    updateElementById(mainTextId, mainText);
    updateElementById(mainText2Id, mainText2);
    requestAnimationFrame(updateTimeDifference);
  };

  requestAnimationFrame(updateTimeDifference);

  return `
        <h2 class="text-2xl font-bold text-gray-800 mb-4" id="${headerId}">undefined</h2>
        <div class="self-center text-center">
          <p class="text-3xl text-gray-700" id="${mainTextId}">undefined</p>
          <p class="text-3xl text-gray-700" id="${mainText2Id}">undefined</p>
        </div>
        <div></div>
    `;
};

const renderSmallCards = () => {
  const smallCardsContainer = document.getElementById('small-card-container');
  // Map each card data object to its HTML string and join them
  smallCardsContainer.innerHTML = cardData.map(createSmallCard).join('');
};

const renderBigCard = () => {
  const bigCardContainer = document.getElementById('big-card-container');

  bigCardContainer.innerHTML = createBigCard(singleCardData);
};

const quotes = [
  "I know what stopped me, and it's never stopping me again. - Jimmy McGill",
  'No more half measures, Walter - Mike Ehrmantraut',
  'Well, technically chemistry is the study of matter. But I prefer to see it as the study of change. - Walter White',
  'I did it for me. I liked it. I was good at it. And, I was really... I was alive - Walter White',
  "You know why I didn't take the job? 'Cause it's too small! I don't care about it! It's nothing to me! It's a bacterium! I travel in worlds you can't even imagine! You can't conceive of what I'm capable of! I'm so far beyond you! I'm like a god in human clothing! Lightning bolts shoot from my fingertips! - Jimmy McGill",
  "S'all good, Man! - Jimmy McGill",
];

const renderQuotes = () => {
  const quote = document.getElementById('random-quotes');

  quote.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];
};

renderSmallCards();
renderBigCard();
renderQuotes();
