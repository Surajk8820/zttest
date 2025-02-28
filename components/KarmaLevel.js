import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Button,
  Tooltip,
  Text,
  Flex,
  Image,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { FaSignal } from "react-icons/fa";
import styles from "../styles/KarmaLevel.module.css";
import { GrNext, GrPrevious } from "react-icons/gr";
import { karmaLevelData } from "./KarmaLevelData";
import { KARMA_SAPIEN_ADDRESS, KARMA_TOKEN_ADDRESS } from "../const/addresses";
import {
  Web3Button,
  useActiveClaimCondition,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimConditions,
  useClaimIneligibilityReasons,
  useContract,
  useNFTBalance,
  useOwnedNFTs,
  useTokenBalance,
  useTokenDrop,
} from "@thirdweb-dev/react";
import { FaLock } from "react-icons/fa";

export function KarmaLevel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const tokenDrop = useTokenDrop(KARMA_TOKEN_ADDRESS);
  const address = useAddress();
  const { data: tokenBalance } = useTokenBalance(tokenDrop, address);
  const toast = useToast();
  const { contract } = useContract(KARMA_SAPIEN_ADDRESS);



  const currentLevel = karmaLevelData[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <>
      <Box onClick={onOpen} color={"white"} width={"100%"} height={"100%"}>
        <Image
          src="https://img.freepik.com/premium-photo/colorful-coelacanth-fish-coral-paper-cut-art-generative-ai_698447-2278.jpg?w=1380"
          alt="karma"
          width={"100%"}
          height={"100%"}
          objectFit={"cover"}
        />
      </Box>

      <Modal
        finalFocusRef={finalRef}
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={"lg"}
      >
        {" "}
        <ModalOverlay />
        <ModalContent
          bg={
            "linear-gradient(180deg, rgba(87,0,72,1) 29%, rgba(26,14,81,1) 81%)"
          }
          color={"white"}
        >
          <ModalHeader fontSize={"18px"}>Karma Sapien Level</ModalHeader>
          <ModalCloseButton />
          <ModalBody className={styles.container}>
            <Box h={"fit-content"}>
              <Flex justify={"space-between"}>
                <Box>
                  <Text fontSize={"32px"}>{currentLevel?.name}</Text>
                  <Flex className={styles.level}>
                    {karmaLevelData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={
                          index === currentIndex
                            ? styles.active
                            : styles.notactive
                        }
                      >
                        {index + 1}
                      </button>
                    ))}
                  </Flex>
                </Box>
                <Flex gap={2}>
                  <Flex color={"#00FFFF"} flexDir="column" align={"center"}>
                    <Image
                      src={"https://imgur.com/jwepmIH.png"}
                      width={"60px"}
                      alt="logo"
                    />
                    <Text fontSize={"12px"}>Carbon Offset</Text>
                    <Text fontSize={"22px"}>
                      {(
                        (Number(tokenBalance?.displayValue) / 10) *
                        0.025
                      ).toFixed(1) || 0}
                      <span style={{ fontSize: "12px" }}>tonne</span>
                    </Text>
                  </Flex>
                  <Flex color={"#0EFF1F"} flexDir="column" align={"center"}>
                    <Image
                      src={"https://imgur.com/FzIURqN.png"}
                      width={"60px"}
                      alt="logo"
                    />
                    <Text fontSize={"12px"}>Trees Planted</Text>
                    <Text fontSize={"22px"}>
                      {Number((tokenBalance?.displayValue / 10).toFixed(0)) ||
                        0}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Box className={styles.NftDiv}>
                <Image
                  w={"100%"}
                  h={"100%"}
                  src={currentLevel?.img}
                  alt="img"
                />
              </Box>
              <Box mt={5} letterSpacing={1} fontSize={"18px"}>
                {currentLevel?.desc}
              </Box>
              <Flex align={"center"} mt={7} justify={"space-around"}>
                <Button
                  w={"50px"}
                  h={"50px"}
                  borderRadius={"50%"}
                  onClick={handlePrevious}
                  bg={"blue"}
                  color={"white"}
                  isDisabled={currentIndex === 0}
                >
                  <GrPrevious />
                </Button>
                <Flex gap={1} textAlign={"center"} flexDir={"column"}>
                  <Text>{`LEVEL ${currentIndex + 1} Requires ${
                    currentLevel?.requiredKarma
                  } KP To Unlock`}</Text>
                  <Web3Button
                    contractAddress={KARMA_SAPIEN_ADDRESS}
                    action={(contract) =>
                      contract.erc1155.claim(currentLevel?.tokenId, 1)
                    }
                    onSuccess={() => {
                      toast({
                        title: `claimed success!`,
                        status: "success",
                        isClosable: true,
                      });
                    }}
                    onError={(e) => {
                      console.log(e.Error);
                    }}
                  >
                    <FaLock />
                  </Web3Button>
                  <Text fontSize={"12px"}>
                    Karma Points needed for next evolution
                  </Text>
                </Flex>
                <Button
                  w={"50px"}
                  h={"50px"}
                  bg={"blue"}
                  color={"white"}
                  borderRadius={"50%"}
                  onClick={handleNext}
                  isDisabled={currentIndex === karmaLevelData?.length - 1}
                >
                  <GrNext />
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
