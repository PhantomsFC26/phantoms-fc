'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('Alex Hunter')
  const [jerseyNumber, setJerseyNumber] = useState('10')
  const [phone, setPhone] = useState