import React from "react";
import { SegementModal } from "./SegmentModal";
import { Button, useDisclosure, Box } from '@chakra-ui/react';

export const Segment = () => {
    const { isOpen, onClose, onOpen } = useDisclosure()

    return (
        <> 
        <Box w='100%' h='100vh' bg='#999999'>
            <Button m={4} px={6} py={4} variant='outline' borderRadius={0} size='sm' _hover={{bg:'#999999'}} bg='#999999' color='white' borderColor='white' border='2px solid' onClick={onOpen}>
                Save segment
            </Button>
        </Box>
            {isOpen && <SegementModal onClose={onClose} isOpen={isOpen} />}
        </>
    )
}