import React from 'react'
import { Button, ButtonProps } from '@ui-kitten/components'
import { useColorScheme } from 'react-native';

const Chip = (props: ButtonProps) => {
  const colorScheme = useColorScheme();

  return (
    <Button
      size="small"
      appearance={colorScheme === "dark" ? "outline" : "filled"}
      status="basic"
      style={{
        borderRadius: 20,
        margin: 4,
      }}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export default Chip