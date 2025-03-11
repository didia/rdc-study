import React from "react";
import { Dropdown } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faFileEdit,
  faHandsHelping,
  faPassport,
  faAssistiveListeningSystems,
} from "@fortawesome/free-solid-svg-icons";

const AssistanceDropdown = ({ isMobile }) => {
  const dropdownItems = [
    {
      href: "/bourse",
      icon: faGraduationCap,
      text: "Je veux une bourse",
    },
    {
      href: "/help",
      icon: faAssistiveListeningSystems,
      text: "Je veux une consultation",
    },
    {
      href: "/assistance",
      icon: faHandsHelping,
      text: "Je veux une assistance",
    },
    {
      href: "/document",
      icon: faFileEdit,
      text: "Je veux une traduction des documents",
    },
    {
      href: "/billet",
      icon: faPassport,
      text: "Je veux acheter un billet",
    },
  ];

  const dropdownClass = isMobile
    ? "md:!hidden !font-['roboto'] !bg-[#4bb4d4] !text-white !text-base !font-bold !py-2 !px-2 !rounded-xl !transition-colors !duration-300 !ease-in-out !hover:bg-yellow-500 !hover:text-white"
    : "hidden md:flex !font-['roboto-bold'] !bg-[#4bb4d4] text-white !text-xl !py-3 !px-3 rounded-xl !transition-colors !duration-300 !ease-in-out !hover:bg-yellow-500 !hover:text-white";

  return (
    <Dropdown
      className={dropdownClass}
      label="Demander une assistance"
      placement="bottom-start"
    >
      {dropdownItems.map((item, index) => (
        <a href={item.href} key={index}>
          <div className="hover:bg-gray-100 cursor-pointer hover:text-yellow-400 hover:text-lg">
            <Dropdown.Item className="mx-4 py-2 text-base font-['roboto']">
              <FontAwesomeIcon icon={item.icon} className="mr-3 h-5" />
              {item.text}
            </Dropdown.Item>
          </div>
        </a>
      ))}
    </Dropdown>
  );
};

export default AssistanceDropdown;
