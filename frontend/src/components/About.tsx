import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarIcon,
} from "@nextui-org/react";

export const About = () => {
  const textSeb = "";
  const textTim = "";
  const textSamuel = "";
  const textNikolas = "";

  const jobSeb = "Frontend, Backend, CAD";
  const jobTim = "Server, Backend";
  const jobSamuel = "Algorithmus";
  const jobNikolas = "Moralische Unterstützung";

  const fragen = [
    "Was ist das Projekt AirSense?",
    "Welche Daten werden gesammelt?",
    "Wozu werden die Daten verwendet?",
    "Wie profitieren Schulen von AirSense?",
  ];

  const antworten = [
    "AirSense ist ein Jugendforschungsprojekt, das CO2- und Temperatursensoren für Klassenräume entwickelt. Diese Sensoren werden über HomeAssistant verbunden, und die Daten sind auf dieser Website live einsehbar.",
    "AirSense sammelt Daten zu CO2-Konzentrationen und Temperaturen in Klassenräumen in Echtzeit.",
    "Die Daten werden verwendet, um Algorithmen zu entwickeln, die beispielsweise feststellen können, ob Fenster geöffnet sind oder ein Klassenraum besetzt ist.",
    "AirSense trägt dazu bei, die Raumluftqualität in Klassenzimmern zu verbessern und ein gesünderes Lernumfeld zu schaffen.s",
  ];

  return (
    <div className="about" id="about">
      <div className="teamJobs">
        <h1>Team</h1>
        <Accordion selectionMode="multiple">
          <AccordionItem
            key="1"
            aria-label="Sebastian"
            startContent={
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            }
            subtitle={jobSeb}
            title="Sebastian"
          >
            {textSeb}
          </AccordionItem>

          <AccordionItem
            key="2"
            aria-label="Tim"
            startContent={
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            }
            subtitle={jobTim}
            title="Tim"
          >
            {textTim}
          </AccordionItem>

          <AccordionItem
            key="3"
            aria-label="Samuel"
            startContent={
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            }
            subtitle={jobSamuel}
            title="Samuel"
          >
            {textSamuel}
          </AccordionItem>

          <AccordionItem
            key="4"
            aria-label="Nikolas"
            startContent={
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            }
            subtitle={jobNikolas}
            title="Nikolas"
          >
            {textNikolas}
          </AccordionItem>
        </Accordion>
      </div>

      <div className="faq">
        <h1>FAQ</h1>
        <Accordion variant="splitted">
          {fragen.map((frage, index) => (
            <AccordionItem key={index} aria-label="Accordion 1" title={frage}>
              {antworten[index]}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
