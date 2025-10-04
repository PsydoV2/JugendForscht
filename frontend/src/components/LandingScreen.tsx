import {
  Link,
  Button,
  Avatar,
  AvatarGroup,
  AvatarIcon,
  Tooltip,
} from "@nextui-org/react";

export const LandingScreen = () => {
  return (
    <div className="landingScreen">
      <div className="landingContent">
        <h1>
          <b>Airsense </b>
        </h1>
        <div className="linksLanding">
          <Button color="primary" variant="flat">
            <a href="#about">About</a>
          </Button>
          <Button
            href="#live"
            as={Link}
            color="primary"
            showAnchorIcon
            variant="solid"
          >
            Live
          </Button>

          <AvatarGroup isBordered className="avatarGroup">
            <Tooltip content="Sebastian">
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            </Tooltip>
            <Tooltip content="Tim">
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            </Tooltip>
            <Tooltip content="Samuel">
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            </Tooltip>
            <Tooltip content="Nikolas">
              <Avatar
                icon={<AvatarIcon />}
                classNames={{
                  base: "bg-gradient-to-br from-[#858585] to-[#1f71ff]",
                  icon: "text-black/80",
                }}
              />
            </Tooltip>
          </AvatarGroup>
        </div>
      </div>
    </div>
  );
};
