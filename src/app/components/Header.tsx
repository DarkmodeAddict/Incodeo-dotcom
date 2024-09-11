'use client'
import React from "react"
import { FloatingNav } from '@/components/ui/floating-navbar'
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react"
import { useAuthStore } from "@/store/Auth"
import slugify from '@/utils/slugify'