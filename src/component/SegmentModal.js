import React, { useState, useEffect, useMemo } from "react"
import { TbMinus } from "react-icons/tb";
import { BsPlus } from "react-icons/bs";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Input,
    DrawerFooter,
    Button,
    FormControl,
    FormLabel,
    Text,
    Flex,
    Radio,
    Stack,
    Box,
    HStack,
    Select
} from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/react';

const { toast } = createStandaloneToast();

export const SegementModal = ({ onClose, isOpen }) => {
    const [schemaField, setSchemaField] = useState([])
    const [schemaValue, setSchemaValue] = useState(null)
    const [segmentName, setSegmentName] = useState('')
    const [remaningSchemaField, setRemainingSchemaField] = useState()
    const [message, setMessage] = useState()
    const [statusValue, setStatusValue] = useState('NotStarted')

    const addNewSchema = () => {
        setSchemaField([...schemaField, schemaValue])
        setRemainingSchemaField(remaningSchemaField.filter(schema => schema.value !== schemaValue))
        setSchemaValue(null)
    }

    const removeSchemaField = (schemaValue) => {
        let schema = [...schemaField]
        const schemaFieldValue = schema.filter(sValue => sValue !== schemaValue)
        const findSchema = SCHEMAFIELDS.find(s => s.value === schemaValue)
        setSchemaField(schemaFieldValue)
        setRemainingSchemaField([...remaningSchemaField, findSchema])
    }

    const handleBlueBoxField = (blueBoxSchemaValue, previousSchemaValue) => {
        let schema = [...schemaField]
        let remaningField = [...remaningSchemaField]
        const findSchema = SCHEMAFIELDS.find(s => s.value === previousSchemaValue)
        const blueBoxSchema = schema.filter(sValue => sValue !== previousSchemaValue)
        const remaningFieldValue = remaningField.filter(r => r.value !== blueBoxSchemaValue)
        setSchemaField([...blueBoxSchema, blueBoxSchemaValue])
        setRemainingSchemaField([...remaningFieldValue, findSchema])
    }

    const handleTraitsColor = (schemaValue) => {
        switch (schemaValue) {
            case 'account_name': return "#d24572";
            case 'city': return "#d24572"
            case 'state': return "#d24572"
            default: return "#5ddb78"
        }
    }

    const SCHEMAFIELDS = useMemo(() => [
        { label: "First Name", value: "first_name" },
        { label: "Last Name", value: "last_name" },
        { label: "Gender", value: "gender" },
        { label: "Age", value: "age" },
        { label: "Account Name", value: "account_name" },
        { label: "City", value: "city" },
        { label: "State", value: "state" },
    ], [])

    useEffect(() => {
        setRemainingSchemaField(SCHEMAFIELDS)
    }, [SCHEMAFIELDS])

    useEffect(() => {
        if (statusValue === 'Success') {
            toast({
                title: 'SUCCESS',
                description: message,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            onClose()
        }
        else if (statusValue === 'Failed') {
            toast({
                title: 'FAILED',
                description: message,
                status: 'failed',
                duration: 4000,
                isClosable: true,
            });
        }
    }, [message, onClose, statusValue])

    const schema = SCHEMAFIELDS.filter(s => schemaField.find(sValue => sValue === s.value))

    let handleSubmit = async (e) => {
        e.preventDefault();
        setStatusValue('Fetching')
        try {
            let requestOption = {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'text/plain;charset=UTF-8',
                },
                body: JSON.stringify({
                    segment_name: segmentName,
                    schema: schema.map(s => {
                        return (
                            {
                                [s.value]: s.label
                            }
                        )
                    })
                }),
            }
            let res = await fetch("https://webhook.site/422ece26-b643-4048-a6b7-696b696c3b6c", requestOption)
            if (res.ok) {
                setStatusValue('Success')
                setMessage('Segment Saved')
            }
            else {
                setStatusValue('Failed')
                setMessage('Something went wrong!')
            }
        } catch (err) {
        }
    };

    return (
        <Drawer
            size='sm'
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
        >
            <DrawerOverlay />
            <form onSubmit={handleSubmit}>
                <DrawerContent bg='#f6f6f6'>
                    <DrawerHeader bg='#39aebc' color='white' mr={2}>
                        <HStack spacing={2} alignItems='center'><MdOutlineKeyboardArrowLeft fontSize={30} /><span>Saving Segment</span></HStack>
                    </DrawerHeader>

                    <DrawerBody mr={2} bg='white' pt={5}>
                        <Box ml={-1}>
                        <FormControl isRequired>
                            <FormLabel pb={1}>Enter the Name of the Segment</FormLabel>
                            <Input placeholder="Name of the segment" borderColor='#babfc5' borderRadius={2} value={segmentName} onChange={(e) => setSegmentName(e.target.value)} />
                        </FormControl>
                        <Text my={5} fontWeight='semibold'>To save your segment, you need to add the schemas to build the query</Text>
                        </Box>
                        <Flex justify='flex-end'>
                            <Stack spacing={5} direction='row'>
                                <HStack mr={-2}>
                                    <Flex w={3} h={3} bg='#5ddb78' mr={-1} borderRadius='50%'></Flex>
                                    <Text>- User Traits</Text>
                                </HStack>
                                <HStack>
                                    <Box w={3} h={3} bg='#d24572' mr={-1} borderRadius='50%'></Box>
                                    <Text>- Group Traits</Text>
                                </HStack>
                            </Stack>
                        </Flex>
                        {schemaField && schemaField.length ?
                            <Box mt={6} mr={-2} ml={-3} px={1} pt={1} pb={0} border='3px solid' borderColor='#72aadd'>

                                {schemaField.map(schemaValue => {
                                    const schema = SCHEMAFIELDS.find(s => s.value === schemaValue)
                                    return (
                                        <HStack key={schemaValue} alignItems='center' py={2} pr={2}>
                                            <Box w={3.5} h={3} ml={1} bg={handleTraitsColor(schemaValue)} borderRadius='50%'></Box>
                                            <Select value={schemaValue} borderColor='#99a2aa' borderRadius={2} onChange={(e) => handleBlueBoxField(e.target.value, schemaValue)}>
                                                {remaningSchemaField && remaningSchemaField.length &&
                                                    remaningSchemaField.map(field =>
                                                        <option key={field.value} value={field.value}>{field.label}</option>
                                                    )}
                                                <option value={schema.value}>{schema.label}</option>
                                            </Select>
                                            <Box p={1} bg='#f2fbf9' onClick={() => removeSchemaField(schemaValue)}><TbMinus fontSize={30} color='#657a93'/></Box>
                                        </HStack>
                                    )
                                }
                                )}
                            </Box>
                            :
                            null
                        }
                        <Box ml={0}>
                            <HStack alignItems='center' py={2} pr={1}>
                            <Box w={3.5} h={3} bg={schemaValue ? handleTraitsColor(schemaValue) : '#e2e4e6'} borderRadius='50%'></Box>
                                <Select disabled={remaningSchemaField?.length <= 0} borderColor='#99a2aa' placeholder='Add schema to segment' value={schemaValue || ''} borderRadius={2} onChange={(e) => setSchemaValue(e.target.value)}>
                                    {remaningSchemaField && remaningSchemaField.length &&
                                        remaningSchemaField.map(field =>
                                            <option key={field.value} value={field.value}>{field.label}</option>
                                        )}
                                </Select>
                                <Button p={1} borderRadius={0} variant='flushed' bg='#f2fbf9' isDisabled={remaningSchemaField?.length <= 0} onClick={() => setSchemaValue(null)}><TbMinus fontSize={30} color='#657a93'/></Button>
                            </HStack>
                        </Box>
                        <Button onClick={addNewSchema} variant='flushed' isDisabled={!schemaValue} textDecoration='underline' color='#45b697' fontWeight='bold' cursor='pointer' ml={-1}><BsPlus/> Add new schema</Button>
                    </DrawerBody>

                    <DrawerFooter pt={6} pb={4} bg='#f6f6f6' justifyContent='flex-start'>
                        <HStack ml={-2} spacing={3}>
                            <Button bg='#41b494' color='white' _hover={{bg:'#41b494'}} py={5} isLoading={statusValue === 'Fetching'} borderRadius={3} size='sm' type='submit'>Save the Segment</Button>
                            <Button mr={3} onClick={onClose} py={5} borderRadius={3} color='#d9658c' _hover={{bg:'white'}} bg='white' size='sm'>
                                Cancel
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </form>
        </Drawer>
    )
}